import type { Submission, SubmissionStatus } from "@/lib/types";

type SupabaseError = {
  message: string;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: SupabaseError | null;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

async function supabaseFetch<T>(path: string, init?: RequestInit) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as SupabaseError | null;
    throw new Error(payload?.message ?? "Supabase request failed.");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function normalizeSubmission(submission: Partial<Submission> & { id: string }) {
  return {
    ...submission,
    plays: submission.plays ?? 0
  } as Submission;
}

export async function createSupabaseSubmission(
  submission: Omit<Submission, "id" | "status" | "created_at" | "plays">
) {
  const payload = {
    ...submission,
    status: "pending",
    plays: 0
  };

  const data = await supabaseFetch<Submission[]>("submissions", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return normalizeSubmission(data[0]);
}

export async function getSupabaseSubmissions() {
  const data = await supabaseFetch<Submission[]>("submissions?select=*&order=created_at.desc");
  return data.map(normalizeSubmission);
}

export async function updateSupabaseSubmissionStatus(id: string, status: SubmissionStatus) {
  const data = await supabaseFetch<Submission[]>(`submissions?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

  return data[0] ? normalizeSubmission(data[0]) : null;
}

export async function incrementSupabaseSubmissionPlay(id: string) {
  const existing = await supabaseFetch<Pick<Submission, "plays">[]>(
    `submissions?select=plays&id=eq.${id}`
  );
  const current = existing[0];

  if (!current) {
    return null;
  }

  const data = await supabaseFetch<Submission[]>(`submissions?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ plays: (current.plays ?? 0) + 1 })
  });

  return data[0] ? normalizeSubmission(data[0]) : null;
}
