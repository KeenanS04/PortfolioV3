# Portfolio — Claude Code context

This file is the durable briefing for any Claude session on this repo. Read it first; it replaces the need to re-derive conventions or hunt through history.

## Who / what

Personal portfolio site for **Keenan Serrao** (UCSD Data Science grad, Data Analyst at Toyota Financial Services). Showcases data/ML work, powerlifting, and photography/videography. Live at Vercel (prod = `main`). Public repo: `KeenanS04/PortfolioV3`.

## Stack

- **Next.js 15.5.x App Router** (TypeScript) — keep pinned to `^15.5.15` or newer; older patches have a CVE Vercel blocks on deploy.
- **Tailwind CSS** with custom `.glass` / `.glass-strong` / `.noise` / `.gradient-border` utilities (see `src/app/globals.css`).
- **next-themes** for light/dark theming. `attribute="class"`, `defaultTheme="system"`, `enableSystem`. Writes `html.light` / `html.dark` and persists to `localStorage.theme`.
- **framer-motion** for entrance + popup animations.
- **lucide-react** for icons.
- **react-simple-maps** + TopoJSON (`public/world-110m.json`, from `world-atlas@2`), projection `geoEquirectangular`, scale 130, canvas 820×410.
- **@vercel/blob** (client-direct upload via `@vercel/blob/client`'s `upload()` + server `handleUpload`) — required because the Vercel serverless body limit is 4.5 MB and phone photos exceed it.
- **@upstash/redis** for KV (pin storage).
- **Behold.so** Instagram feed (feed id `9y9LdJFkEZRj4br4AQtA`, account `@keenbeannnnn`).
- **Nominatim (OpenStreetMap)** for geocoding, rate-limited to **1 request/second** (we use 1100 ms). User-Agent must be set (`keenan-portfolio/1.0`).

## Repo map

```
src/app/
  layout.tsx              # body has suppressHydrationWarning (Grammarly ext)
  page.tsx                # composes homepage sections
  globals.css             # glass utilities, marquee keyframes
  admin/
    page.tsx              # server: isAdmin() gate
    AdminClient.tsx       # map + form + pin list + backfill
    LoginClient.tsx
  api/
    admin/login/          # POST sets admin-token cookie; DELETE clears
    admin/status/         # diagnostic: env var configured?
    travel/               # GET pins (public)
    travel/pins/          # POST create (JSON, admin), DELETE remove (admin)
    travel/upload/        # handleUpload signed URL for direct-to-Blob
    travel/backfill/      # admin: reverse-geocode pins missing country
    geocode/              # admin: forward Nominatim proxy
    geocode/reverse/      # admin: reverse Nominatim proxy

src/components/
  ThemeProvider.tsx       # thin next-themes wrapper (class attribute, system default)
  Nav.tsx                 # dynamic-island pill + separate circular theme toggle to
                          # the right. Pill is fully rounded (!rounded-full) to
                          # match the toggle's curvature. Toggle is h-[54px] w-[54px]
                          # (includes .glass 1px border on each side).
  Hero.tsx                # "Data Analyst · Powerlifter · Storyteller" eyebrow,
                          # skills marquee mixes technical + lifestyle skills,
                          # min-h-screen, mounts <Background /> scoped to hero.
                          # NO overflow-hidden — blobs spill softly into next section.
  Background.tsx          # aurora blob backdrop (pink/cyan/purple) with float
                          # + drift keyframes. No mask, no overflow clipping — blobs
                          # are sized so their radial falloff ends inside (or just
                          # beyond) the hero, and the page `body` has overflow-x
                          # hidden to stop horizontal scroll on wide viewports.
                          # Grid lines + top glow use CSS vars so they swap in light.
  About.tsx               # stats quadrant (TODO: 2nd paragraph + "currently exploring")
  Experience.tsx
  Projects.tsx            # GitHub repos filtered by topic = "project"
  Skills.tsx              # includes Snowflake, Tableau, Excel
  Instagram.tsx           # Behold feed, titled "Lifting, traveling, and more"
  Travel.tsx              # public map, groups pins by city, click popup
  WorldMap.tsx            # shared map, supports onClick + highlighted Set
  Section.tsx             # shared section wrapper with eyebrow + title

src/lib/
  travel.ts               # TravelPin type + KV CRUD at key "travel:pins:v1"
  auth.ts                 # ADMIN_COOKIE "admin-token", timingSafeEqual vs
                          # trimmed ADMIN_PASSWORD; cookies must be trimmed too
  countryAliases.ts       # canonicalCountry() → Natural Earth name for highlight matching

public/world-110m.json    # world-atlas v2 TopoJSON (geo.properties.name)
```

## Environment variables (Vercel)

| Var | Where | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | Production + Preview (sensitive) | Gates `/admin` and all admin APIs |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | All envs | Upstash Redis for pin storage. `UPSTASH_REDIS_REST_URL` / `_TOKEN` also accepted as fallback |
| `BLOB_READ_WRITE_TOKEN` | All envs | Vercel Blob (auto-injected when store is linked) |

If `/admin` rejects the right password: hit `/api/admin/status` — it returns `{ configured, length, trimmedLength }` so you can see if the env var is present and whether it has whitespace.

## Data model

```ts
// src/lib/travel.ts
type TravelPin = {
  id: string;
  name: string;          // trip name, shown on pin detail
  city?: string;         // used for grouping + map label
  country?: string;      // raw name; normalize via canonicalCountry() before highlighting
  coords: [number, number]; // [lon, lat] — note lon first, lat second
  caption?: string;
  images: string[];      // public Blob URLs
  createdAt: string;     // ISO
};
```

KV key: `travel:pins:v1`. `getPins`, `savePins`, `addPin`, `deletePin` in `src/lib/travel.ts`.

## Design system notes

- **Liquid glass**: `backdrop-filter: blur(...)`, subtle gradient border via `.gradient-border`, noise overlay from `.noise`. Don't add solid backgrounds to section cards — break the aesthetic.
- **Color accents**:
  - Visited-country fill: cyan `rgba(34, 211, 238, 0.38)` with pale-cyan stroke.
  - Public pins: ivory `#fdf2f8` fill, pink `#f472b6` stroke, pink glow ring at 25% alpha, pulsing `animate`.
  - Admin pending pin: yellow `#fde047` (distinct from saved pins).
- **Typography**: section eyebrows are small all-caps with wide tracking (`tracking-[0.22em]`), cyan-tinted.
- **Animations**: entrance fades use `transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}`.

## Non-obvious gotchas (read before touching the relevant area)

1. **Map click capture rect must render AFTER `<Geography>` children**, and geography paths need `pointerEvents: 'none'` when `onClick` is provided. Otherwise clicks hit a country and the admin drop-pin handler never fires. See `WorldMap.tsx`.
2. **Popup position flips at edges**: `Travel.tsx` computes `flipX` / `flipY` against the container bbox and swaps `left`/`right` + `top`/`bottom`. Don't change the popup width without updating `POPUP_W`.
3. **Image preload on pin fetch** prevents first-click popup jank. Removing that loop brings the lag back.
4. **Country highlighting requires name normalization**. User may type "United States", Nominatim returns "United States", Natural Earth uses "United States of America". `canonicalCountry()` handles the alias map — extend it when a new country doesn't light up.
5. **Uploads must go direct to Blob.** Do not POST image files to a serverless route; the 4.5 MB limit will 413 on phone photos. Use `upload()` from `@vercel/blob/client` with `handleUploadUrl: "/api/travel/upload"`. The pin POST itself sends JSON with pre-uploaded URLs.
6. **Nominatim throttle**: sequential requests, 1100 ms apart, User-Agent set. Backfill route has `maxDuration = 60` — ~50 pins max per run.
7. **Admin auth trims whitespace** on both the env var and the submitted password; env vars pasted from password managers often carry a trailing newline.
8. **Nav centering**: the pill is wrapped in a static `flex justify-center` parent. A framer-motion `y` on the pill would override the Tailwind `-translate-x-1/2` approach. Don't "simplify" that wrapper away.
9. **Grammarly browser extension** injects attributes into `<body>` post-hydration. `suppressHydrationWarning` on the body in `layout.tsx` silences the warning; don't remove it.
10. **Background blobs must NOT use `-z-10`** on the fixed/absolute wrapper. Because `<main>` has `position: relative` without isolation, a negative z-index escapes main's paint layer and the blobs render behind the body's dark background (invisible). Use `z-0` and rely on document order (Background is the section's first child, content comes after).
11. **Theming is CSS-var driven, not per-component.** `globals.css` defines tokens (`--tint`, `--shadow`, `--grid-line`, `--map-land`, etc.) on `:root` for dark and overrides them on `html.light`. The `.glass` / `.noise` / scrollbar / selection styles all consume the tokens so flipping a class re-themes the whole site. Component files use Tailwind `text-white/*` / `bg-white/*` / `border-white/*` classes unchanged — a block near the bottom of `globals.css` inverts those classes to dark ink under `html.light`. **If you add a new opacity variant** (say `text-white/35`), add a matching `html.light .text-white\/35` rule or it won't read in light mode.
12. **Instagram tile caption text must stay white in both themes.** The tiles overlay a dark `from-black/70` gradient on the image regardless of theme, so the Tailwind `text-white/90` inversion would make captions unreadable on light. Use the helper classes `.ig-tile-text` / `.ig-tile-meta` / `.ig-tile-badge` (defined in `globals.css`) on those elements to pin them white in both modes.
13. **Don't use `outline` for hover highlights on rounded overflow-hidden cards.** Chromium renders `outline` as a rectangle when `outline-offset` is non-zero or when the box is clipped, producing visible sharp corners. Use either a transition on the existing `.glass` `border` color, a scale transform (`whileHover={{ scale: 1.02 }}`), or an absolute inset-0 overlay with `box-shadow: inset 0 0 0 1px …`. All three follow `border-radius` cleanly.
14. **Framer-motion hover transforms on a card with `overflow-hidden` + `border-radius` can flash a sharp corner for one frame** as the compositor promotes the element to its own GPU layer and the rounded clip hasn't re-applied yet. Fix: add `[will-change:transform]` so the layer is persistent, and `[clip-path:inset(0_round_<radius>)]` so clipping is a true clipping op rather than a fragile overflow mask. Projects.tsx cards are the canonical example.
15. **Blobs should NOT be clipped.** The hero intentionally has no `overflow-hidden` and `Background.tsx` has no mask. Blobs extend past the hero on purpose — their radial gradients fall off to transparent so the edge is soft. Horizontal scroll is prevented by `html, body { overflow-x: hidden }` in `globals.css`, not by clipping the hero. Don't re-add `overflow-hidden` to the hero to "fix" overflow — it brings back the visible cutoff line.

## Branch workflow

- `main` → Vercel production. Protect by convention; only merge via `develop`.
- `develop` → Vercel preview / staging. Stable integration branch.
- `feat/<name>` → per-feature branches off `develop`. PR (or direct merge) `feat/* → develop → main`. Delete feature branches after merge (local + remote).
- Commits use `--no-ff` merges so feature history stays visible.

## Working norms

- **Never commit without explicit ask.** Run builds / lints to verify, but wait for "commit this" before creating a commit.
- **Never amend.** Always a new commit; amend loses work if a hook fails.
- **Next.js version**: if Vercel build fails with a CVE block, bump `next` — don't downgrade around it.
- **Don't write docs or READMEs unprompted.** This file is the exception.
- **Check `/api/admin/status` first** when admin auth misbehaves, before assuming code is wrong.

## Known TODOs

- `src/components/About.tsx`: second paragraph and "currently exploring" line still have placeholder comments.
- Backlog (not started): cursor-reactive parallax, "Now" card, Spotify now-playing, lift stats strip, ⌘K command palette, case-study pages, resume PDF link.

## When in doubt

1. Read this file.
2. Read `git log --oneline -30` — commit messages explain the *why* of recent decisions.
3. Read the specific file you're changing (not just grep for a symbol).
4. Ask before refactoring anything in the "gotchas" section above.
