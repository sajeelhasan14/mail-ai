"use client";
import { useState } from "react";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";
import RecipientForm from "./RecipientForm";

type Email = { subject: string; body: string };

export default function EmailComposer() {
  const [to, setTo] = useState("");
  const [sent, setSent] = useState(false);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setEmail(null);
    setSent(false);
    try {
      const isFirst = !email;
      const endpoint = isFirst ? "/api/generate" : "/api/revise";
      const body = isFirst ? { input } : { email, feedback: input };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // if (!res.ok) throw new Error("Request failed: " + res.status);
      const data = await res.json();
      setEmail(data.email);
    } catch (err) {
      console.error(err);
      alert(
        "Couldn't generate — likely a rate limit. Wait a minute and try again.",
      );
    } finally {
      setLoading(false); // ← always runs, so the button never gets stuck
    }
  }

  async function handleSend() {
    if (!email || !to) {
      alert("Please enter a recipient email address.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ to, subject: email.subject, body: email.body }),
      });
      if (!res.ok) throw new Error("Send failed: " + res.status);
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Couldn't send the email. Check the recipient and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <EmailForm
        value={input}
        onChange={setInput}
        onSubmit={handleGenerate}
        loading={loading}
        placeholder={
          email
            ? "How should I change it? e.g. make it shorter and more formal"
            : "Describe the email you want…"
        }
        submitlabel={email ? "Revise" : "Generate Email"}
      />

      {email && (
        <>
          <EmailPreview email={email} />
          <RecipientForm value={to} onChange={setTo} />

          <button onClick={handleSend} disabled={sending || !to}>
            {sending ? "Sending…" : "Approve & Send"}
          </button>

          {sent && <p>✅ Email sent to {to}</p>}
        </>
      )}
    </div>
  );
}
