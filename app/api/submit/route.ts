import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";
import { createSupabaseSubmission, isSupabaseConfigured } from "@/lib/supabase";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

const requiredFields = ["artist_name", "email", "track_title", "genre", "language", "track_link"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    for (const field of requiredFields) {
      if (!String(formData.get(field) ?? "").trim()) {
        return NextResponse.json({ error: `${field.replace("_", " ")} is required.` }, { status: 400 });
      }
    }

    const upload_url = await saveUpload(formData.get("audio") as File | null);
    const submissionPayload = {
      artist_name: String(formData.get("artist_name")),
      email: String(formData.get("email")),
      track_title: String(formData.get("track_title")),
      genre: String(formData.get("genre")),
      language: String(formData.get("language")),
      track_link: String(formData.get("track_link")),
      message: String(formData.get("message") ?? ""),
      upload_url
    };
    const submission = isSupabaseConfigured()
      ? await createSupabaseSubmission(submissionPayload)
      : await addSubmission(submissionPayload);

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
