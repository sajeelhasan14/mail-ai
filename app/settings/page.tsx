"use client";
import { useEffect, useState } from "react";

type Profile = {
  full_name: string;
  title: string;
  company: string;
  phone: string;
};

export default function SettingsPage() {
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
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 20 }}>
      <h1>Your Profile</h1>
      <p>Used to sign your emails.</p>
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
