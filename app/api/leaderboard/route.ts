import { NextResponse } from "next/server";
import { backendMode, getLeaderboard, getSettings } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    if (!settings.leaderboard_enabled) {
      return NextResponse.json({ enabled: false, mode: backendMode(), rows: [] });
    }
    return NextResponse.json({ enabled: true, mode: backendMode(), rows: await getLeaderboard() });
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    return NextResponse.json(
      { enabled: true, mode: backendMode(), rows: [], error: "Leaderboard temporarily unavailable." },
      { status: 500 }
    );
  }
}
