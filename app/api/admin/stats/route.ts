import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/hunt-store";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  return NextResponse.json(await getAdminStats());
}


