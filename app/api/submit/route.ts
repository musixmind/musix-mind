import { NextResponse } from "next/server";
import { sendDemoSubmissionEmails } from "@/lib/email";
import { addSubmission } from "@/lib/submissions";
import { createSupabaseSubmission, isSupabaseConfigured } from "@/lib/supabase";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

const requiredFields = ["artist_name", "email", "track_title", "genre", "language", "track_link"];

type SubmitBody = {
  artist_name?: string;
  email?: string;
  track_title?: string;
  genre?: string;
  language?: string;
  track_link?: string;
  message?: string;
  upload_url?: string;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let submissionPayload: {
      artist_name: string;
      email: string;
      track_title: string;
      genre: string;
      language: string;
      track_link: string;
      message: string;
      upload_url?: string;
    };

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as SubmitBody;

      for (const field of requiredFields) {
        if (!String(body[field as keyof SubmitBody] ?? "").trim()) {
          return NextResponse.json({ error: `${field.replace("_", " ")} is required.` }, { status: 400 });
        }
      }

      submissionPayload = {
        artist_name: String(body.artist_name),
        email: String(body.email),
        track_title: String(body.track_title),
        genre: String(body.genre),
        language: String(body.language),
        track_link: String(body.track_link),
        message: String(body.message ?? ""),
        upload_url: body.upload_url?.trim() || undefined
      };
    } else {
      const formData = await request.formData();

      for (const field of requiredFields) {
        if (!String(formData.get(field) ?? "").trim()) {
          return NextResponse.json({ error: `${field.replace("_", " ")} is required.` }, { status: 400 });
        }
      }

      const upload_url = await saveUpload(formData.get("audio") as File | null);
      submissionPayload = {
        artist_name: String(formData.get("artist_name")),
        email: String(formData.get("email")),
        track_title: String(formData.get("track_title")),
        genre: String(formData.get("genre")),
        language: String(formData.get("language")),
        track_link: String(formData.get("track_link")),
        message: String(formData.get("message") ?? ""),
        upload_url
      };
    }

    const submission = isSupabaseConfigured()
      ? await createSupabaseSubmission(submissionPayload)
      : await addSubmission(submissionPayload);
    const emailResult = await sendDemoSubmissionEmails({
      ...submissionPayload,
      submission_id: submission.id,
      created_at: submission.created_at
    });

    return NextResponse.json(
      {
        submission,
        notificationError: emailResult.ok ? undefined : emailResult.error
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit demo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
