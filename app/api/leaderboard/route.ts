import { NextResponse } from "next/server";
import { backendMode, getLeaderboard, getSettings } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  if (!settings.leaderboard_enabled) {
    return NextResponse.json({ enabled: false, mode: backendMode(), rows: [] });
  }
  return NextResponse.json({ enabled: true, mode: backendMode(), rows: await getLeaderboard() });
}
