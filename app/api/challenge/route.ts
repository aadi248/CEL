import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ChallengeError, getChallengeStatus, startChallenge, submitChallenge } from "@/lib/challenge-store";

export const dynamic = "force-dynamic";

async function playerId() {
  return (await cookies()).get("cel_player_id")?.value ?? null;
}

function failure(error: unknown) {
  if (error instanceof ChallengeError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  return NextResponse.json({ error: error instanceof Error ? error.message : "The FORGE challenge failed." }, { status: 400 });
}

export async function GET() {
  try {
    const id = await playerId();
    if (!id) return NextResponse.json({ player: null }, { status: 401 });
    return NextResponse.json(await getChallengeStatus(id));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  try {
    const id = await playerId();
    if (!id) return NextResponse.json({ error: "Check in before attempting a question." }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    if (body.action === "start") return NextResponse.json(await startChallenge(id));
    if (body.action === "answer") {
      return NextResponse.json(await submitChallenge(id, String(body.attempt_id ?? ""), Number(body.selected_index)));
    }
    return NextResponse.json({ error: "Unknown challenge action." }, { status: 400 });
  } catch (error) {
    return failure(error);
  }
}
