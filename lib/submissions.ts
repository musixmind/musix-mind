import { promises as fs } from "fs";
import path from "path";
import type { Submission, SubmissionStatus } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "submissions.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, "[]", "utf8");
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  await ensureStore();
  const file = await fs.readFile(dbPath, "utf8");
  const submissions = JSON.parse(file) as Submission[];
  return submissions.map((submission) => ({
    ...submission,
    language: submission.language ?? "Unknown",
    plays: submission.plays ?? 0
  }));
}

export async function addSubmission(
  submission: Omit<Submission, "id" | "status" | "created_at" | "plays">
) {
  const submissions = await getSubmissions();
  const nextSubmission: Submission = {
    ...submission,
    id: crypto.randomUUID(),
    status: "Pending",
    created_at: new Date().toISOString(),
    plays: 0
  };

  submissions.unshift(nextSubmission);
  await fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), "utf8");
  return nextSubmission;
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  const submissions = await getSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id);

  if (index === -1) {
    return null;
  }

  submissions[index] = { ...submissions[index], status };
  await fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), "utf8");
  return submissions[index];
}

export async function incrementSubmissionPlay(id: string) {
  const submissions = await getSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id);

  if (index === -1) {
    return null;
  }

  submissions[index] = {
    ...submissions[index],
    plays: submissions[index].plays + 1
  };
  await fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), "utf8");
  return submissions[index];
}

export const statuses: SubmissionStatus[] = ["Pending", "Reviewed", "Shortlisted", "Signed"];
