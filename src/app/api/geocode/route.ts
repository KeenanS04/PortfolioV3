import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("featuretype", "city");

  try {
    const r = await fetch(url.toString(), {
      headers: { "User-Agent": "keenan-portfolio/1.0 (contact: admin)" },
      next: { revalidate: 86400 },
    });
    if (!r.ok) return NextResponse.json({ results: [] });
    type NomResult = {
      lat: string;
      lon: string;
      display_name: string;
      address?: { city?: string; town?: string; village?: string; state?: string; country?: string };
    };
    const raw = (await r.json()) as NomResult[];
    const results = raw.map((it) => ({
      label: it.display_name,
      city:
        it.address?.city ||
        it.address?.town ||
        it.address?.village ||
        it.display_name.split(",")[0],
      country: it.address?.country,
      lon: Number(it.lon),
      lat: Number(it.lat),
    }));
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
