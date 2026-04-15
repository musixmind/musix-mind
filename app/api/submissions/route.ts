import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/submissions";

export const runtime = "nodejs";

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json({ submissions });
}
