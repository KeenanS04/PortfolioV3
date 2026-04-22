import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const pw = process.env.ADMIN_PASSWORD;
  return NextResponse.json({
    configured: Boolean(pw && pw.trim().length > 0),
    length: pw ? pw.length : 0,
    trimmedLength: pw ? pw.trim().length : 0,
  });
}
