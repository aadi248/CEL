"use client";

import { useCallback, useEffect, useState } from "react";
import { CompletionCard } from "@/components/CompletionCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { OnboardingForm } from "@/components/OnboardingForm";
import { ProgressGrid } from "@/components/ProgressGrid";
import type { FunFact, Piece, Player, PuzzleScan, ScanResult } from "@/types/hunt";
import { UNLOCK_MESSAGES } from "@/lib/content";

type State = {
  loading: boolean;
  player: Player | null;
  scans: PuzzleScan[];
  result: ScanResult | null;
  error: string | null;
};

export function ScanExperience({ piece }: { piece: Piece }) {
  const [state, setState] = useState<State>({ loading: true, player: null, scans: [], result: null, error: null });

  const loadAndScan = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const playerResponse = await fetch("/api/player", { cache: "no-store" });
      const playerData = await playerResponse.json();
      if (!playerResponse.ok) throw new Error(playerData.error ?? "Could not find your hunt profile.");
      if (!playerData.player) {
        setState({ loading: false, player: null, scans: [], result: null, error: null });
        return;
      }

      const scanResponse = await fetch(`/api/scan/${piece.number}`, { method: "POST" });
      const scanData = await scanResponse.json();
      if (!scanResponse.ok) {
        setState({ loading: false, player: playerData.player, scans: playerData.scans ?? [], result: null, error: scanData.error ?? "Scan failed." });
        return;
      }
      setState({ loading: false, player: scanData.player, scans: scanData.scans, result: scanData, error: null });
    } catch (error) {
      setState({
        loading: false,
        player: null,
        scans: [],
        result: null,
        error: error instanceof Error ? error.message : "The hunt briefly lost the signal. Refresh once."
      });
    }
  }, [piece.number]);

  useEffect(() => {
    loadAndScan();
  }, [loadAndScan]);

  if (state.loading) return <div className="loading">FINDING YOUR POSITION...</div>;

  if (!state.player) {
    return (
      <section className="grid-layout">
        <div>
          <div className="kicker">PIECE {String(piece.number).padStart(2, "0")} / 06</div>
          <h1 className="display-title">{piece.headline}</h1>
          <p className="copy">Before the first scan, CEL needs a name for the index. Nothing too dramatic. Unless earned.</p>
        </div>
        <OnboardingForm onDone={loadAndScan} />
      </section>
    );
  }

  const foundPieces = state.scans.map((scan) => scan.piece_number);
  const completed = foundPieces.length >= 6 || state.player.completed;
  const unlock: FunFact | null = state.result?.unlock ?? null;
  const messagePool = UNLOCK_MESSAGES[piece.number] ?? [];
  const message = state.result?.is_new_piece
    ? messagePool[Math.floor(Math.random() * messagePool.length)] ?? messagePool[0]
    : "YOU ALREADY HAVE THIS PIECE. Fine. Here is a different note for your trouble.";

  return (
    <section className="grid-layout scan-layout">
      <div>
        <div className="mobile-scan-strip" aria-label={`${foundPieces.length} of 6 pieces found`}>
          <span>CEL / HUNT</span>
          <strong>{String(foundPieces.length).padStart(2, "0")} / 06</strong>
        </div>
        <div className="kicker">PIECE {String(piece.number).padStart(2, "0")} / 06 · {piece.theme}</div>
        <h1 className="display-title">{state.result?.is_new_piece ? `PIECE ${String(piece.number).padStart(2, "0")} FOUND.` : "YOU ALREADY HAVE THIS PIECE."}</h1>
        <p className="copy">{state.error ?? message}</p>
        <div className="panel">
          <div className="label">{piece.visual}</div>
          <h2 className="fact-title">{piece.headline}</h2>
          <p className="fact-body">{piece.proposition}</p>
        </div>
        {completed ? (
          <div className="panel">
            <div className="label">FINAL STATUS</div>
            <h2 className="section-title">YOU FOUND THEM ALL.</h2>
            <p className="copy">
              Which means you made it further than most people who only opened the first QR.
              <br />
              You are eligible for: <strong>A chance at a startup internship in your first year.</strong>
            </p>
            <CompletionCard player={state.player} code={state.result?.completion_code ?? `CEL-HUNT-${state.player.id.slice(-6).toUpperCase()}`} />
          </div>
        ) : null}
      </div>
      <aside>
        <ProgressGrid found={foundPieces} current={piece.number} justUnlocked={state.result?.is_new_piece ? piece.number : null} />
        {unlock ? (
          <article className="unlock-card" style={{ marginTop: 16 }}>
            <div className="label">{unlock.kind === "joke" ? "FIELD NOTE" : "FACT DROP"}</div>
            <h2>{unlock.title}</h2>
            <p className="fact-body">{unlock.body}</p>
            {unlock.kind === "fact" ? (
              <div className="source">
                SOURCE · <a href={unlock.source_url} target="_blank" rel="noreferrer">{unlock.source}</a>
                {unlock.source_date ? ` · ${unlock.source_date}` : ""}
              </div>
            ) : null}
          </article>
        ) : null}
        <section className="panel">
          <div className="label">THE INDEX</div>
          <LeaderboardTable compact />
        </section>
      </aside>
    </section>
  );
}
