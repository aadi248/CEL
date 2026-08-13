"use client";

import { useEffect, useState } from "react";
import type { LeaderboardRow } from "@/types/hunt";

function PieceRun({ pieces }: { pieces: number[] }) {
  const found = new Set(pieces);
  return (
    <span className="piece-run" aria-label={`Scanned pieces: ${pieces.length ? pieces.join(", ") : "none"}`}>
      {Array.from({ length: 6 }, (_, index) => {
        const piece = index + 1;
        return <span className={found.has(piece) ? "scanned" : undefined} key={piece}>{piece}</span>;
      })}
    </span>
  );
}

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
    const initialLoad = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(load, 5000);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!enabled) return <p className="copy">The leaderboard is currently hidden. Dramatic, but intentional.</p>;

  return (
    <>
      {mode === "local" ? <p className="source">LOCAL DEVELOPMENT MODE · Connect Firebase before deploying to share this board event-wide.</p> : null}
      <table className="leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Scanned</th>
            <th>Status</th>
            {!compact ? <th className="desktop-only">Time</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, compact ? 8 : 60).map((row) => (
            <tr key={row.player_id}>
              <td>{String(row.rank).padStart(2, "0")}</td>
              <td className="player">{row.display_name}</td>
              <td><PieceRun pieces={row.piece_numbers ?? []} /></td>
              <td className={row.completed ? "status-complete" : undefined}>{row.completed ? "COMPLETE" : `${row.pieces} / 6`}</td>
              {!compact ? <td className="desktop-only">{row.elapsed_seconds ? `${Math.round(row.elapsed_seconds / 60)}m` : "—"}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
