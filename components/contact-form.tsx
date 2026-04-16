"use client";

import { useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setState("error");
      setNotice(payload.error ?? "Unable to send message.");
      return;
    }

    formRef.current?.reset();
    setState("sent");
    setNotice("Message sent. We will get back to you soon.");
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input className="field" name="name" placeholder="Name" required />
        <input className="field" name="email" type="email" placeholder="Email" required />
        <textarea className="field min-h-36" name="message" placeholder="Message" required />
        <button className="primary-button" disabled={state === "sending"} type="submit">
          {state === "sending" ? "Sending..." : "Send Message"}
        </button>
        {state === "error" && notice ? <p className="text-sm text-red-300">{notice}</p> : null}
      </form>

      {state === "sent" ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm rounded-lg p-6 text-center shadow-glow">
            <button
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/55 transition hover:text-white"
              onClick={() => setState("idle")}
              aria-label="Close message sent popup"
            >
              <X className="h-4 w-4" />
            </button>
            <CheckCircle2 className="mx-auto mt-2 h-12 w-12 text-emerald-300" />
            <h2 className="mt-4 text-2xl font-black">Message sent</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{notice}</p>
            <button className="primary-button mt-6 w-full" onClick={() => setState("idle")}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
