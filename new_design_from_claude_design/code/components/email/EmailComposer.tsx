"use client";
import { useState } from "react";
import { Email } from "./types";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";
import RecipientForm from "./RecipientForm";
import Button from "../ui/Button";

export default function EmailComposer() {
  const [to, setTo] = useState("");
  const [sent, setSent] = useState(false);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setSent(false);
    try {
      const isFirst = !email;
      const endpoint = isFirst ? "/api/generate" : "/api/revise";
      const body = isFirst ? { input, to } : { email, feedback: input };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
      const data = await res.json();
      setEmail(data.email);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("The AI is busy — wait a minute and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!email || !to) {
      setError("Enter a recipient email address first.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ to, subject: email.subject, body: email.body, tone: email.tone }),
      });
      if (!res.ok) throw new Error("Send failed: " + res.status);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't send the email. Check the recipient and try again.");
    } finally {
      setSending(false);
    }
  }

  function handleNewEmail() {
    setInput("");
    setEmail(null);
    setTo("");
    setSent(false);
    setError(null);
  }

  return (
    <main className="mx-auto flex max-w-[780px] flex-col gap-8 px-6 pb-24 pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-[44px] uppercase leading-none text-black">Write an <span className="bg-[#f8e800] px-2">email</span></h1>
        <p className="font-mono text-sm text-black">
          Two agents draft + review. You approve. It sends from your Gmail.
        </p>
      </header>

      <RecipientForm value={to} onChange={setTo} />

      <div className="flex flex-col gap-2">
        <EmailForm
          value={input}
          onChange={setInput}
          onSubmit={handleGenerate}
          loading={loading}
          label={email ? "Revise ▸ tell the agents what to change" : "Brief ▸ describe the email"}
          placeholder={
            email ? "e.g. make it shorter and more formal" : "Describe the email you want…"
          }
          submitlabel={email ? "Revise" : "Generate Email"}
        />
        {error && (
          <div
            role="alert"
            className="border-[3px] border-black bg-[#f8e800] px-3.5 py-2.5 font-mono text-[13px] font-bold uppercase text-black"
          >
            ⚠ {error}
          </div>
        )}
      </div>

      {!email && !loading && (
        <section className="flex flex-col items-center gap-2.5 border-[3px] border-dashed border-black px-8 py-12 text-center">
          <div className="font-heading text-2xl uppercase text-black">No draft yet</div>
          <p className="max-w-[420px] font-mono text-sm text-black">
            Describe the email above — e.g. “Ask Sara to move Friday’s demo to 3pm, keep it
            friendly.” The draft appears here for you to edit.
          </p>
        </section>
      )}

      {email && (
        <section className="flex flex-col gap-6">
          <EmailPreview email={email} onChange={(e) => { setEmail(e); setSent(false); }} />
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="accent" onClick={handleSend} disabled={sending || !to}>
              {sending ? "Sending…" : "Approve & Send"}
            </Button>
            <Button variant="secondary" onClick={handleNewEmail} disabled={loading || sending}>
              New email
            </Button>
          </div>
          {sent && (
            <p className="border-[3px] border-black bg-[#00d95f] px-4 py-3.5 font-mono text-[15px] font-bold uppercase text-black shadow-[5px_5px_0_#000]">
              ✅ Sent to {to}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
