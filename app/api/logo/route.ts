import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const logoPath = path.join(process.cwd(), "assets", "logo.png");
  try {
    const data = await fs.readFile(logoPath);
    return new NextResponse(data, {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=3600"
      }
    });
  } catch {
    return NextResponse.json({ error: "Logo not found at assets/logo.png" }, { status: 404 });
  }
}


