import clsx from "clsx";
import { PIECES } from "@/lib/pieces";

const piecePath = "M8 8H43C40 11 39 14 39 18C39 26 45 31 52 31C60 31 65 26 65 18C65 14 64 11 61 8H112V36C109 34 106 33 102 33C94 33 88 40 88 48C88 56 94 63 102 63C106 63 109 62 112 60V92H70C72 89 73 86 73 82C73 74 67 68 59 68C51 68 45 74 45 82C45 86 46 89 48 92H8V61C11 63 14 64 18 64C26 64 32 58 32 50C32 42 26 36 18 36C14 36 11 37 8 39Z";

function StartupGlyph({ piece }: { piece: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (piece === 1) {
    return <g {...common}><circle cx="60" cy="48" r="9" /><circle cx="39" cy="67" r="5" /><circle cx="83" cy="66" r="5" /><path d="M53 55 43 63M67 55l12 8M60 39V30" /><circle cx="60" cy="25" r="4" /></g>;
  }
  if (piece === 2) {
    return <g {...common}><circle cx="49" cy="42" r="7" /><circle cx="73" cy="42" r="7" /><path d="M35 72c2-14 8-21 14-21s12 7 14 21M59 72c2-14 8-21 14-21s12 7 14 21" /></g>;
  }
  if (piece === 3) {
    return <g {...common}><rect x="35" y="32" width="50" height="34" rx="3" /><path d="M29 73h62M52 73l2-7h14l2 7M44 54l9-9 8 6 13-12" /></g>;
  }
  if (piece === 4) {
    return <g {...common}><path d="M35 70V55M51 70V47M67 70V39M83 70V29M32 76h56M35 43l15-10 14 3 19-16" /><path d="m74 20 9-1-1 9" /></g>;
  }
  if (piece === 5) {
    return <g {...common}><path d="m31 48 13-12 15 9 16-9 14 13-24 24H53L31 53Z" /><path d="m44 45 16 14c4 3 9-3 5-7l-7-7M74 55l7 7M68 62l6 6" /></g>;
  }
  return <g {...common}><path d="M61 26c15 7 22 21 19 38L62 77 44 64c-3-17 4-31 17-38Z" /><circle cx="61" cy="47" r="7" /><path d="m45 58-10 6-2 13 14-8M77 58l10 6 2 13-14-8M55 78l6 9 6-9" /></g>;
}

export function PuzzlePieceVisual({ piece, found = false, current = false, justUnlocked = false }: { piece: number; found?: boolean; current?: boolean; justUnlocked?: boolean }) {
  const meta = PIECES[piece - 1];
  return (
    <svg
      className={clsx("puzzle-piece-visual", found && "is-found", current && "is-current", justUnlocked && "is-unlocking")}
      viewBox="0 0 120 100"
      role="img"
      aria-label={`${meta?.theme ?? `Piece ${piece}`} — ${found ? "found" : "locked"}`}
    >
      <path className="puzzle-piece-fill" d={piecePath} />
      <g className="puzzle-glyph"><StartupGlyph piece={piece} /></g>
      <text className="puzzle-number" x="19" y="24">{String(piece).padStart(2, "0")}</text>
    </svg>
  );
}

export function StartupPuzzle({ found = [], current, justUnlocked, showcase = false }: { found?: number[]; current?: number; justUnlocked?: number | null; showcase?: boolean }) {
  const uniqueFound = new Set(found);
  return (
    <div className={clsx("startup-puzzle", showcase && "showcase-puzzle")}>
      <div className="puzzle-board" aria-label="Six-piece startup puzzle">
        {PIECES.map((piece) => (
          <div className={`puzzle-slot accent-${piece.accent}`} key={piece.number}>
            <PuzzlePieceVisual piece={piece.number} found={showcase || uniqueFound.has(piece.number)} current={current === piece.number} justUnlocked={justUnlocked === piece.number} />
          </div>
        ))}
      </div>
      {showcase ? (
        <div className="puzzle-legend" aria-hidden="true">
          <span>NETWORK</span><span>TEAM</span><span>PRODUCT</span><span>GROWTH</span><span>COMMUNITY</span><span>LAUNCH</span>
        </div>
      ) : null}
    </div>
  );
}
