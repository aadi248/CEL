"use client";

import { useRef } from "react";
import type { Player } from "@/types/hunt";

export function CompletionCard({ player, code }: { player: Player; code: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function download() {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#F2EFE6";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#111111";
    ctx.strokeRect(0.5, 0.5, rect.width - 1, rect.height - 1);
    ctx.fillStyle = "#7A1E1E";
    ctx.fillRect(rect.width * 0.49, 0, rect.width * 0.02, rect.height);
    ctx.fillStyle = "#111111";
    ctx.font = "12px Arial";
    ctx.fillText("CEL", 24, 32);
    ctx.fillText("THE SIX-PIECE HUNT", 24, 52);
    ctx.font = "44px Times New Roman";
    ctx.fillText(player.nickname.toUpperCase(), 24, rect.height * 0.52);
    ctx.font = "12px Arial";
    ctx.fillText("COMPLETION STATUS   06 / 06", 24, rect.height - 72);
    ctx.fillText("STATUS   ELIGIBLE FOR INTERNSHIP OPPORTUNITY", 24, rect.height - 50);
    ctx.fillText(`CEL · BITS PILANI GOA   ID: ${code}`, 24, rect.height - 28);
    const link = document.createElement("a");
    link.download = `${code}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div>
      <div className="completion-card" ref={cardRef}>
        <div>
          <div className="brand-mark">CEL</div>
          <div className="label">THE SIX-PIECE HUNT</div>
        </div>
        <div className="name">{player.nickname}</div>
        <div className="meta">
          COMPLETION STATUS&nbsp;&nbsp;06 / 06
          <br />
          STATUS&nbsp;&nbsp;ELIGIBLE FOR INTERNSHIP OPPORTUNITY
          <br />
          CEL · BITS PILANI GOA&nbsp;&nbsp;ID: {code}
        </div>
      </div>
      <div className="actions">
        <button className="button maroon" onClick={download} type="button">
          DOWNLOAD CARD
        </button>
        <span className="meta">SHOW THIS AT CEL INDUCTION</span>
      </div>
    </div>
  );
}
