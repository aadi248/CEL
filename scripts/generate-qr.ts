import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { PIECES } from "../lib/pieces";

async function main() {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const outDir = path.join(process.cwd(), "public", "generated", "qr");
  await fs.mkdir(outDir, { recursive: true });

  const rows: string[] = [];
  for (const piece of PIECES) {
    const url = `${base}/scan/${piece.number}`;
    const svg = await QRCode.toString(url, { type: "svg", margin: 2, color: { dark: "#111111", light: "#F2EFE6" }, errorCorrectionLevel: "H" });
    const png = await QRCode.toBuffer(url, { type: "png", width: 1200, margin: 2, color: { dark: "#111111", light: "#F2EFE6" }, errorCorrectionLevel: "H" });
    const name = `poster-${String(piece.number).padStart(2, "0")}-${piece.slug}`;
    await fs.writeFile(path.join(outDir, `${name}.svg`), svg);
    await fs.writeFile(path.join(outDir, `${name}.png`), png);
    rows.push(`<article><h2>POSTER ${String(piece.number).padStart(2, "0")} / ${piece.theme}</h2><img src="./${name}.svg" /><p>${url}</p></article>`);
  }

  await fs.writeFile(
    path.join(outDir, "contact-sheet.html"),
    `<!doctype html><html><head><meta charset="utf-8"><title>CEL Hunt QR Contact Sheet</title><style>body{font-family:Arial,sans-serif;background:#F2EFE6;color:#111;margin:24px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}article{border:1px solid #111;padding:16px;break-inside:avoid}img{width:220px;max-width:100%}h1,h2{font-family:"Times New Roman",serif;font-weight:400}</style></head><body><h1>CEL — The Six-Piece Hunt</h1><div class="grid">${rows.join("")}</div></body></html>`
  );
  console.log(`Generated QR files in ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
