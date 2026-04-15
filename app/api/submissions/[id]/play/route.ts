import { NextResponse } from "next/server";
import { incrementSubmissionPlay } from "@/lib/submissions";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const submission = await incrementSubmissionPlay(params.id);

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ submission });
}
