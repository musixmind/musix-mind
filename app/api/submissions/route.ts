import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/submissions";
import { getSupabaseSubmissions, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const submissions = isSupabaseConfigured() ? await getSupabaseSubmissions() : await getSubmissions();
  return NextResponse.json({ submissions });
}
