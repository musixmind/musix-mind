type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
};

type DemoSubmissionEmailInput = {
  artist_name: string;
  email: string;
  track_title: string;
  genre: string;
  language: string;
  track_link: string;
  message: string;
  upload_url?: string;
  submission_id: string;
  created_at: string;
};

function normalizeEmailAddress(value: string | undefined, fallback: string) {
  const configured = value?.trim();

  if (!configured) {
    return fallback;
  }

  const unquoted = configured.replace(/^["']|["']$/g, "").trim();
  const emailOnly = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  const nameAndEmail = /^.+\s<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>$/;

  if (emailOnly.test(unquoted) || nameAndEmail.test(unquoted)) {
    return unquoted;
  }

  return fallback;
}

function getSenderEmail() {
  return normalizeEmailAddress(
    process.env.CONTACT_FROM_EMAIL,
    "MUSIX MIND <onboarding@resend.dev>"
  );
}

function getDemoSenderEmail() {
  return normalizeEmailAddress(process.env.DEMO_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL, getSenderEmail());
}

function getDemoRecipientEmail() {
  return normalizeEmailAddress(
    process.env.DEMO_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL,
    "musixmind1@gmail.com"
  );
}

function getSiteUrl() {
  return (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.musixmind.com").trim();
}

function buildAbsoluteUploadUrl(uploadUrl?: string) {
  if (!uploadUrl) {
    return undefined;
  }

  if (/^https?:\/\//i.test(uploadUrl)) {
    return uploadUrl;
  }

  return new URL(uploadUrl, getSiteUrl()).toString();
}

async function sendResendEmail(payload: {
  from: string;
  to: string;
  subject: string;
  text: string;
  reply_to?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "RESEND_API_KEY is not configured in Vercel."
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return { ok: true };
  }

  const responsePayload = (await response.json().catch(() => null)) as {
    message?: string;
    error?: string;
  } | null;

  return {
    ok: false,
    error: responsePayload?.message ?? responsePayload?.error ?? "Resend rejected the email request."
  };
}

export async function sendContactEmail(input: ContactEmailInput) {
  return sendResendEmail({
    from: getSenderEmail(),
    to: process.env.CONTACT_TO_EMAIL ?? "musixmind1@gmail.com",
    reply_to: input.email,
    subject: `New MUSIX MIND contact message from ${input.name}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`
  });
}

export async function sendDemoSubmissionEmails(input: DemoSubmissionEmailInput) {
  const from = getDemoSenderEmail();
  const uploadUrl = buildAbsoluteUploadUrl(input.upload_url);
  const uploadedFileText = uploadUrl
    ? `Uploaded audio file: ${uploadUrl}`
    : "Uploaded audio file: No audio file uploaded";

  const [artistResult, adminResult] = await Promise.all([
    sendResendEmail({
      from,
      to: input.email,
      subject: `Demo received: ${input.track_title} | MUSIX MIND`,
      text: [
        `Hi ${input.artist_name},`,
        "",
        "Your demo has been submitted successfully to MUSIX MIND.",
        "Our A&R team will review it and contact you if it moves forward.",
        "",
        "Submission summary:",
        `Artist: ${input.artist_name}`,
        `Track: ${input.track_title}`,
        `Genre: ${input.genre}`,
        `Language: ${input.language}`,
        `Track link: ${input.track_link}`,
        uploadedFileText,
        "",
        "Thank you for submitting your music.",
        "MUSIX MIND"
      ].join("\n")
    }),
    sendResendEmail({
      from,
      to: getDemoRecipientEmail(),
      reply_to: input.email,
      subject: `New demo submission from ${input.artist_name} | ${input.track_title}`,
      text: [
        "A new demo was submitted on musixmind.com.",
        "",
        `Submission ID: ${input.submission_id}`,
        `Submitted at: ${input.created_at}`,
        `Artist: ${input.artist_name}`,
        `Artist email: ${input.email}`,
        `Track title: ${input.track_title}`,
        `Genre: ${input.genre}`,
        `Language: ${input.language}`,
        `Track link: ${input.track_link}`,
        uploadedFileText,
        "",
        "Artist message:",
        input.message || "No message provided."
      ].join("\n")
    })
  ]);

  const errors = [artistResult, adminResult]
    .filter((result) => !result.ok)
    .map((result) => result.error)
    .filter(Boolean);

  if (errors.length > 0) {
    return {
      ok: false,
      error: errors.join(" ")
    };
  }

  return { ok: true };
}
