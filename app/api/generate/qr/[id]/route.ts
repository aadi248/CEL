import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireGenerator } from "@/lib/generator-auth";
import { getQrCode } from "@/lib/hunt-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = requireGenerator(request);
  if (auth) return auth;
  const { id } = await context.params;
  const code = await getQrCode(id);
  if (!code) return NextResponse.json({ error: "QR code not found." }, { status: 404 });
  const params = new URL(request.url).searchParams;
  const format = params.get("format") === "png" ? "png" : "svg";
  const disposition = params.get("download") === "1" ? "attachment" : "inline";
  const options = {
    margin: 2,
    color: { dark: code.foreground, light: code.background },
    errorCorrectionLevel: "H" as const
  };

  if (format === "png") {
    const buffer = await QRCode.toBuffer(code.target, { ...options, type: "png", width: 1200 });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "content-type": "image/png",
        "content-disposition": `${disposition}; filename=${code.id}.png`
      }
    });
  }
  const svg = await QRCode.toString(code.target, { ...options, type: "svg" });
  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "content-disposition": `${disposition}; filename=${code.id}.svg`
    }
  });
}
