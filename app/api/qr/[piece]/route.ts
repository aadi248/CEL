import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { appBaseUrl } from "@/lib/utils";
import { getPiece, isValidPiece } from "@/lib/pieces";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ piece: string }> }) {
  const { piece } = await context.params;
  const pieceNumber = Number(piece);
  if (!isValidPiece(pieceNumber)) return NextResponse.json({ error: "Invalid piece." }, { status: 404 });
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "png" ? "png" : "svg";
  const url = `${appBaseUrl().replace(/\/$/, "")}/scan/${pieceNumber}`;
  const pieceMeta = getPiece(pieceNumber);

  if (format === "png") {
    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 1200,
      margin: 2,
      color: { dark: "#111111", light: "#F2EFE6" },
      errorCorrectionLevel: "H"
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "content-type": "image/png",
        "content-disposition": `attachment; filename=cel-hunt-${pieceNumber}-${pieceMeta?.slug ?? "piece"}.png`
      }
    });
  }

  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: "#111111", light: "#F2EFE6" },
    errorCorrectionLevel: "H"
  });
  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "content-disposition": `inline; filename=cel-hunt-${pieceNumber}-${pieceMeta?.slug ?? "piece"}.svg`
    }
  });
}


