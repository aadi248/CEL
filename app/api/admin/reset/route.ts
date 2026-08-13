import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { resetProgress } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  await resetProgress();
  return NextResponse.json({ ok: true });
}


