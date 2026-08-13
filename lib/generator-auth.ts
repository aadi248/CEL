import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const generatorCookie = "cel_generator_session";

function credentials() {
  return {
    username: process.env.GENERATOR_USERNAME || "admin",
    password: process.env.GENERATOR_PASSWORD || "admin@1234"
  };
}

function sessionSecret() {
  return process.env.GENERATOR_SESSION_SECRET || credentials().password;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function verifyGeneratorCredentials(username: string, password: string) {
  const expected = credentials();
  return safeEqual(username, expected.username) && safeEqual(password, expected.password);
}

export function createGeneratorSession() {
  const payload = Buffer.from(JSON.stringify({ sub: credentials().username, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isGeneratorSessionValid(token: string | undefined | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    return parsed.sub === credentials().username && typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireGenerator(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === generatorCookie)?.[1];
  if (isGeneratorSessionValid(token)) return null;
  return NextResponse.json({ error: "Generator sign-in required." }, { status: 401 });
}
