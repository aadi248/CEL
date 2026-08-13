import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getPiece, isValidPiece } from "@/lib/pieces";
import { ScanExperience } from "@/components/ScanExperience";

export const dynamic = "force-dynamic";

export default async function ScanPage({ params }: { params: Promise<{ piece: string }> }) {
  const { piece } = await params;
  const pieceNumber = Number(piece);
  if (!isValidPiece(pieceNumber)) notFound();
  const pieceMeta = getPiece(pieceNumber);
  if (!pieceMeta) notFound();

  return (
    <main className="shell" style={{ "--accent": `var(--${pieceMeta.accent})` } as React.CSSProperties}>
      <Header />
      <ScanExperience piece={pieceMeta} />
    </main>
  );
}
