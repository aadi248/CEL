"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { LeaderboardRow } from "@/types/hunt";

export function LeaderboardTable({ initialRows = [], compact = false }: { initialRows?: LeaderboardRow[]; compact?: boolean }) {
  const [rows, setRows] = useState(initialRows);
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState("local");

  async function load() {
    const response = await fetch("/api/leaderboard", { cache: "no-store" });
    const data = await response.json();
    setRows(data.rows ?? []);
    setEnabled(Boolean(data.enabled));
    setMode(data.mode);
  }

  useEffect(() => {
    load();
    const supabase = supabaseBrowser();
    if (!supabase) return;
    const channel = supabase
      .channel("cel-hunt-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "puzzle_scans" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!enabled) return <p className="copy">The leaderboard is currently hidden. Dramatic, but intentional.</p>;

  return (
    <>
      {mode === "local" ? <p className="source">LOCAL MODE: this leaderboard is not globally shared. Supabase enables live campus-wide updates.</p> : null}
      <table className="leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Pieces</th>
            <th>Status</th>
            {!compact ? <th className="desktop-only">Time</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, compact ? 8 : 60).map((row) => (
            <tr key={row.player_id}>
              <td>{String(row.rank).padStart(2, "0")}</td>
              <td className="player">{row.display_name}</td>
              <td>{row.pieces} / 6</td>
              <td className={row.completed ? "status-complete" : undefined}>{row.completed ? "COMPLETE" : `${row.pieces} / 6`}</td>
              {!compact ? <td className="desktop-only">{row.elapsed_seconds ? `${Math.round(row.elapsed_seconds / 60)}m` : "—"}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
