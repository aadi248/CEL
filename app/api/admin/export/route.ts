import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAdminStats } from "@/lib/hunt-store";
import { csvEscape } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const stats = await getAdminStats();
  const rows = [
    ["rank", "player", "pieces", "scanned_piece_numbers", "completed", "completion_time", "elapsed_seconds"],
    ...stats.leaderboard.map((row) => [row.rank, row.display_name, row.pieces, row.piece_numbers.join(" "), row.completed, row.completion_time, row.elapsed_seconds])
  ];
  return new NextResponse(rows.map((row) => row.map(csvEscape).join(",")).join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=cel-hunt-export.csv"
    }
  });
}

