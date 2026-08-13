import { NextResponse } from "next/server";
import {
  createGeneratorSession,
  generatorCookie,
  isGeneratorSessionValid,
  verifyGeneratorCredentials
} from "@/lib/generator-auth";

export const dynamic = "force-dynamic";

function requestToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === generatorCookie)?.[1];
}

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: isGeneratorSessionValid(requestToken(request)) });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!verifyGeneratorCredentials(String(body.username ?? ""), String(body.password ?? ""))) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(generatorCookie, createGeneratorSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60,
    path: "/"
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(generatorCookie, "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
