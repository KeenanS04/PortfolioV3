# Portfolio — Claude Code context

This file is the durable briefing for any Claude session on this repo. Read it first; it replaces the need to re-derive conventions or hunt through history.

## Who / what

Personal portfolio site for **Keenan Serrao** (UCSD Data Science grad, Data Analyst at Toyota Financial Services). Showcases data/ML work, powerlifting, and photography/videography. Live at Vercel (prod = `main`). Public repo: `KeenanS04/PortfolioV3`.

## Stack

- **Next.js 15.5.x App Router** (TypeScript) — keep pinned to `^15.5.15` or newer; older patches have a CVE Vercel blocks on deploy.
- **Tailwind CSS** with custom `.glass` / `.glass-strong` / `.noise` / `.gradient-border` utilities (see `src/app/globals.css`).
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
  Nav.tsx                 # dynamic-island pill, centered via flex wrapper
                          # (framer-motion y would fight translate-x-1/2)
  Hero.tsx                # "Storyteller" eyebrow, skills marquee with mask fade
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
