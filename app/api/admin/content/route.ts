import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { upsertContent, deleteContent } from "@/lib/hunt-store";
import { makeId } from "@/lib/utils";
import type { FunFact } from "@/types/hunt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const body = await request.json();
  const item: FunFact = {
    id: body.id || makeId("content"),
    category: String(body.category || "custom"),
    title: String(body.title || "UNTITLED"),
    body: String(body.body || ""),
    source: String(body.source || "Admin supplied"),
    source_url: String(body.source_url || ""),
    source_date: body.source_date ? String(body.source_date) : null,
    accent_color: body.accent_color || "maroon",
    active: Boolean(body.active),
    kind: body.kind === "joke" ? "joke" : "fact"
  };
  return NextResponse.json(await upsertContent(item));
}

export async function DELETE(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await deleteContent(id);
  return NextResponse.json({ ok: true });
}


