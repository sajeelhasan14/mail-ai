"use client";
import { useState } from "react";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";

type Email = { subject: string; body: string };

export default function EmailComposer() {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setEmail(null);
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
      {email && <EmailPreview email={email} />}
    </div>
  );
}
// write an email to durood.fatima14@gmail.com for the meeting tomorrow at 5 pm at my office
