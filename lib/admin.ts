import { NextResponse } from "next/server";

export function requireAdmin(request: Request) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured && process.env.NODE_ENV !== "production") return null;
  const supplied = request.headers.get("x-admin-password") || new URL(request.url).searchParams.get("password");
  if (configured && supplied === configured) return null;
  return NextResponse.json({ error: "Admin password required." }, { status: 401 });
}
