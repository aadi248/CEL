import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { recordScan } from "@/lib/hunt-store";
import { isValidPiece } from "@/lib/pieces";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ piece: string }> }) {
  try {
    const { piece } = await context.params;
    const pieceNumber = Number(piece);
    if (!isValidPiece(pieceNumber)) return NextResponse.json({ error: "Invalid piece." }, { status: 404 });
    const playerId = (await cookies()).get("cel_player_id")?.value;
    if (!playerId) return NextResponse.json({ error: "Onboarding required." }, { status: 401 });
    const result = await recordScan(playerId, pieceNumber);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Scan failed." }, { status: 400 });
  }
}


