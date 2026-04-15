import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

const requiredFields = ["artist_name", "email", "track_title", "genre", "track_link"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    for (const field of requiredFields) {
      if (!String(formData.get(field) ?? "").trim()) {
        return NextResponse.json({ error: `${field.replace("_", " ")} is required.` }, { status: 400 });
      }
    }

    const upload_url = await saveUpload(formData.get("audio") as File | null);
    const submission = await addSubmission({
      artist_name: String(formData.get("artist_name")),
      email: String(formData.get("email")),
      track_title: String(formData.get("track_title")),
      genre: String(formData.get("genre")),
      track_link: String(formData.get("track_link")),
      message: String(formData.get("message") ?? ""),
      upload_url
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
