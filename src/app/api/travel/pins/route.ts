import { NextRequest, NextResponse } from "next/server";
import { addPin, deletePin, TravelPin } from "@/lib/travel";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "pin";
}

type PinRequest = {
  name?: string;
  city?: string;
  country?: string;
  lon?: number;
  lat?: number;
  caption?: string;
  imageUrls?: string[];
};

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as PinRequest;
    const name = (body.name ?? "").trim();
    const city = (body.city ?? "").trim();
    const country = (body.country ?? "").trim();
    const caption = (body.caption ?? "").trim();
    const lon = Number(body.lon);
    const lat = Number(body.lat);
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.filter(Boolean) : [];

    if (!name || Number.isNaN(lon) || Number.isNaN(lat)) {
      return NextResponse.json({ error: "name, lon, lat required" }, { status: 400 });
    }

    const id = `${Date.now().toString(36)}-${slug(name)}`;
    const pin: TravelPin = {
      id,
      name,
      city: city || undefined,
      country: country || undefined,
      coords: [lon, lat],
      caption: caption || undefined,
      images: imageUrls,
      createdAt: new Date().toISOString(),
    };
    const pins = await addPin(pin);
    return NextResponse.json({ pin, pins });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const pins = await deletePin(id);
  return NextResponse.json({ pins });
}
