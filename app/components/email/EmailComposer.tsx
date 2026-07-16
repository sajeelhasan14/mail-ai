"use client";
import { useState } from "react";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";

type Email = { subject: string; body: string };

export default function EmailComposer() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setEmail(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
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
        value={description}
        onChange={setDescription}
        onSubmit={handleGenerate}
        loading={loading}
      />
      {email && <EmailPreview email={email} />}
    </div>
  );
}
// write an email to durood.fatima14@gmail.com for the meeting tomorrow at 5 pm at my office
