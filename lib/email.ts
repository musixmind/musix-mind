type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(input: ContactEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "musixmind1@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "MUSIX MIND <onboarding@resend.dev>";

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
    body: JSON.stringify({
      from,
      to,
      reply_to: input.email,
      subject: `New MUSIX MIND contact message from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`
    })
  });

  if (response.ok) {
    return { ok: true };
  }

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    error?: string;
  } | null;

  return {
    ok: false,
    error: payload?.message ?? payload?.error ?? "Resend rejected the email request."
  };
}
