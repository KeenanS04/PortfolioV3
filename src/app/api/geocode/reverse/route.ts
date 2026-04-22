import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat, lon required" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  try {
    const r = await fetch(url.toString(), {
      headers: { "User-Agent": "keenan-portfolio/1.0 (contact: admin)" },
      next: { revalidate: 86400 },
    });
    if (!r.ok) return NextResponse.json({ error: `nominatim ${r.status}` }, { status: 502 });
    type Rev = {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
      };
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
    return NextResponse.json({ city, country: j.address?.country ?? "" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
