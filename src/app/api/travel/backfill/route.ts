import { NextResponse } from "next/server";
import { getPins, savePins } from "@/lib/travel";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function reverseLookup(lon: number, lat: number) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  const r = await fetch(url.toString(), {
    headers: { "User-Agent": "keenan-portfolio/1.0 (backfill)" },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`nominatim ${r.status}`);
  type Rev = {
    address?: { city?: string; town?: string; village?: string; state?: string; country?: string };
    display_name?: string;
  };
  const j = (await r.json()) as Rev;
  const city =
    j.address?.city ||
    j.address?.town ||
    j.address?.village ||
    j.address?.state ||
    j.display_name?.split(",")[0] ||
    "";
  return { city, country: j.address?.country ?? "" };
}

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const pins = await getPins();
    let touched = 0;
    const log: Array<{ id: string; city?: string; country?: string; error?: string }> = [];

    for (const p of pins) {
      if (p.country && p.country.trim()) continue;
      try {
        const [lon, lat] = p.coords;
        const rev = await reverseLookup(lon, lat);
        if (rev.country) p.country = rev.country;
        if (!p.city && rev.city) p.city = rev.city;
        touched++;
        log.push({ id: p.id, city: p.city, country: p.country });
      } catch (e) {
        log.push({ id: p.id, error: (e as Error).message });
      }
      // Nominatim public policy: 1 request per second.
      await new Promise((r) => setTimeout(r, 1100));
    }

    if (touched > 0) await savePins(pins);
    return NextResponse.json({ touched, total: pins.length, pins, log });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
