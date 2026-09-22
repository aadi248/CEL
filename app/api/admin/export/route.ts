import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getLeaderboard } from "@/lib/hunt-store";
import { csvEscape } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const leaderboard = await getLeaderboard();
  const top30 = leaderboard.slice(0, 30);

  const rows = [
    ["rank", "full_name"],
    ...top30.map((row) => [row.rank, row.display_name])
  ];

  return new NextResponse(
    rows.map((row) => row.map(csvEscape).join(",")).join("\n"),
    {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=cel-top-30.csv"
      }
    }
  );
}
