import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { updateSettings } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const body = await request.json();
  return NextResponse.json(await updateSettings({
    hunt_enabled: Boolean(body.hunt_enabled),
    leaderboard_enabled: Boolean(body.leaderboard_enabled),
    announcement: body.announcement ? String(body.announcement) : null
  }));
}


