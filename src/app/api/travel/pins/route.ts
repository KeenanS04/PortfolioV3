import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const lon = Number(form.get("lon"));
    const lat = Number(form.get("lat"));
    const caption = String(form.get("caption") ?? "").trim();
    const files = form.getAll("images").filter((f): f is File => f instanceof File);

    if (!name || Number.isNaN(lon) || Number.isNaN(lat)) {
      return NextResponse.json({ error: "name, lon, lat required" }, { status: 400 });
    }

    const id = `${Date.now().toString(36)}-${slug(name)}`;
    const urls: string[] = [];
    for (const f of files) {
      if (f.size === 0) continue;
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
      const blob = await put(`travel/${id}/${crypto.randomUUID()}.${ext}`, f, {
        access: "public",
        contentType: f.type || "image/jpeg",
      });
      urls.push(blob.url);
    }

    const pin: TravelPin = {
      id,
      name,
      coords: [lon, lat],
      caption: caption || undefined,
      images: urls,
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
