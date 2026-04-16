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

    const emailResult = await sendContactEmail({ name, email, message });

    if (!emailResult.ok) {
      return NextResponse.json({ error: emailResult.error }, { status: 502 });
    }

    await saveContactMessage({
      name,
      email,
      message,
      email_sent: true
    }).catch(() => null);

    return NextResponse.json({
      message: "Message sent successfully."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
