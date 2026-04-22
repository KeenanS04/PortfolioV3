import { NextResponse } from "next/server";
import { getPins } from "@/lib/travel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pins = await getPins();
    return NextResponse.json({ pins });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
