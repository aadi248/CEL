import { NextResponse } from "next/server";
import { deleteQrCode, listQrCodes, saveQrCode } from "@/lib/hunt-store";
import { requireGenerator } from "@/lib/generator-auth";

export const dynamic = "force-dynamic";

const colorPattern = /^#[0-9a-f]{6}$/i;

export async function GET(request: Request) {
  const auth = requireGenerator(request);
  if (auth) return auth;
  return NextResponse.json({ codes: await listQrCodes() });
}

export async function POST(request: Request) {
  const auth = requireGenerator(request);
  if (auth) return auth;
  const body = await request.json();
  const label = String(body.label ?? "").trim().slice(0, 60);
  const target = String(body.target ?? "").trim().slice(0, 1200);
  const notes = String(body.notes ?? "").trim().slice(0, 180) || null;
  const foreground = String(body.foreground ?? "#111111");
  const background = String(body.background ?? "#f2efe6");
  if (label.length < 2) return NextResponse.json({ error: "Give the code a label." }, { status: 400 });
  if (!target) return NextResponse.json({ error: "Add a URL or text value to encode." }, { status: 400 });
  if (!colorPattern.test(foreground) || !colorPattern.test(background)) {
    return NextResponse.json({ error: "QR colours must be six-digit hex values." }, { status: 400 });
  }
  const code = await saveQrCode({ label, target, notes, foreground, background });
  return NextResponse.json({ code }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = requireGenerator(request);
  if (auth) return auth;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing QR code ID." }, { status: 400 });
  await deleteQrCode(id);
  return NextResponse.json({ ok: true });
}
