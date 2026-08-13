"use client";

import clsx from "clsx";

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
      <div className="piece-grid">
        {Array.from({ length: 6 }, (_, index) => {
          const piece = index + 1;
          const isFound = uniqueFound.includes(piece);
          return (
            <div
              className={clsx("piece-cell", isFound && "found", current === piece && "current", justUnlocked === piece && "just-unlocked")}
              key={piece}
              aria-label={`Piece ${piece} ${isFound ? "found" : "locked"}`}
            >
              <span>{String(piece).padStart(2, "0")}</span>
            </div>
          );
        })}
      </div>
      <div className="meta">{String(uniqueFound.length).padStart(2, "0")} / 06 FOUND</div>
    </section>
  );
}
