import { NextResponse } from "next/server";
import { statuses, updateSubmissionStatus } from "@/lib/submissions";
import type { SubmissionStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = (await request.json()) as { status?: SubmissionStatus };

  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const submission = await updateSubmissionStatus(params.id, body.status);

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ submission });
}
