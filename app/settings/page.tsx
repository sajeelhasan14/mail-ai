"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  full_name: string;
  title: string;
  company: string;
  phone: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    title: "",
    company: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile((p) => ({ ...p, ...d.profile })));
  }, []);

  async function save() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaved(true);
    router.push("/");
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 20 }}>
      <h1>Your Profile</h1>
      <p>Used to sign your emails.</p>
      {!profile.full_name && (
        <p style={{ background: "#eef", padding: 10, borderRadius: 6 }}>
          👋 Welcome! Set up your signature so your emails are signed correctly.
        </p>
      )}
      {(["full_name", "title", "company", "phone"] as const).map((f) => (
        <input
          key={f}
          placeholder={f.replace("_", " ")}
          value={profile[f] ?? ""}
          onChange={(e) => setProfile({ ...profile, [f]: e.target.value })}
          style={{
            display: "block",
            width: "100%",
            padding: 8,
            marginBottom: 8,
          }}
        />
      ))}
      <button onClick={save}>Save</button>
      {saved && <p>✅ Saved</p>}
    </div>
  );
}
