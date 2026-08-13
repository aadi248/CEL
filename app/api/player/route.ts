import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPlayer, getPlayer, getPlayerScans } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const playerId = cookieStore.get("cel_player_id")?.value;
  const player = await getPlayer(playerId);
  const scans = player ? await getPlayerScans(player.id) : [];
  return NextResponse.json({ player, scans });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const player = await createPlayer({
      nickname: String(body.nickname ?? ""),
      branch: body.branch ? String(body.branch) : null,
      bits_id: body.bits_id ? String(body.bits_id) : null
    });
    const response = NextResponse.json({ player, scans: [] });
    response.cookies.set("cel_player_id", player.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 120,
      path: "/"
    });
    response.cookies.set("cel_player_hint", player.id, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 120,
      path: "/"
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create player." }, { status: 400 });
  }
}


