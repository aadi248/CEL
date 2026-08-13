import { NextResponse } from "next/server";
import { requireGenerator } from "@/lib/generator-auth";
import { resetProgress } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const auth = requireGenerator(request);
  if (auth) return auth;

  try {
    await resetProgress();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear leaderboard:", error);
    return NextResponse.json({ error: "Could not clear the leaderboard." }, { status: 500 });
  }
}
