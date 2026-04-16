import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/contact-messages";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const emailSent = await sendContactEmail({ name, email, message });
    const contactMessage = await saveContactMessage({
      name,
      email,
      message,
      email_sent: emailSent
    });

    return NextResponse.json({
      message: emailSent
        ? "Message sent successfully."
        : "Message saved. Email delivery needs RESEND_API_KEY configured.",
      contactMessage
    });
  } catch {
    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
