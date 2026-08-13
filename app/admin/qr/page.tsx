import Image from "next/image";
import { Header } from "@/components/Header";
import { CopyButton } from "@/components/CopyButton";
import { PrintButton } from "@/components/PrintButton";
import { PIECES } from "@/lib/pieces";
import { appBaseUrl } from "@/lib/utils";

export default function QrPage() {
  const base = appBaseUrl().replace(/\/$/, "");
  return (
    <main className="shell">
      <Header />
      <section style={{ padding: "34px 0" }}>
        <div className="kicker">ADMIN / QR</div>
        <h1 className="display-title">POSTER CODES.</h1>
        <div className="actions no-print">
          <PrintButton />
          <a className="button secondary" href="/admin">BACK TO ADMIN</a>
        </div>
        <div className="qr-grid" style={{ marginTop: 24 }}>
          {PIECES.map((piece) => {
            const url = `${base}/scan/${piece.number}`;
            return (
              <article className="qr-card" key={piece.number}>
                <div className="label">POSTER {String(piece.number).padStart(2, "0")}</div>
                <h2 className="fact-title">{piece.theme}</h2>
                <Image alt={`QR code for poster ${piece.number}`} src={`/api/qr/${piece.number}`} width={360} height={360} unoptimized />
                <p className="source">{url}</p>
                <div className="actions no-print">
                  <a className="button secondary" href={`/api/qr/${piece.number}?format=png`}>PNG</a>
                  <a className="button secondary" href={`/api/qr/${piece.number}?format=svg`}>SVG</a>
                  <CopyButton value={url} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
