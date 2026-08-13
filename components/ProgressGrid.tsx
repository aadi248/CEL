"use client";

import { StartupPuzzle } from "@/components/StartupPuzzle";

export function ProgressGrid({
  found,
  current,
  justUnlocked
}: {
  found: number[];
  current?: number;
  justUnlocked?: number | null;
}) {
  const uniqueFound = Array.from(new Set(found));
  return (
    <section className="panel" aria-label="Hunt progress">
      <div className="label">THE HUNT</div>
      <StartupPuzzle found={uniqueFound} current={current} justUnlocked={justUnlocked} />
      <div className="progress-summary">
        <strong>{String(uniqueFound.length).padStart(2, "0")}</strong>
        <span>of 06 pieces locked in</span>
      </div>
    </section>
  );
}
