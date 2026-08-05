"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

type Profile = {
  full_name: string;
  title: string;
  company: string;
  phone: string;
};

const FIELDS: { key: keyof Profile; label: string; placeholder: string }[] = [
  { key: "full_name", label: "Full name", placeholder: "Alex Rivera" },
  { key: "title", label: "Job title", placeholder: "Product Lead" },
  { key: "company", label: "Company", placeholder: "Northwind" },
  { key: "phone", label: "Phone", placeholder: "(555) 010-4432" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    title: "",
    company: "",
    phone: "",
  });
  const [firstTime, setFirstTime] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const p = d.profile ?? {};
        setProfile({
          full_name: p.full_name ?? "",
          title: p.title ?? "",
          company: p.company ?? "",
          phone: p.phone ?? "",
        });
        setFirstTime(!p.full_name);
      });
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
    <div className="min-h-screen bg-[#f4f4f0]">
      <Navbar />
      <main className="mx-auto flex max-w-[620px] flex-col gap-7 px-6 pb-24 pt-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-[44px] uppercase leading-none text-black">
            Your profile
          </h1>
          <p className="font-mono text-sm text-black">Used to sign your emails.</p>
        </header>

        {firstTime && (
          <div className="flex flex-col gap-1 border-[3px] border-black bg-[#f8e800] px-5 py-4 shadow-[6px_6px_0_#000]">
            <span className="font-heading text-base uppercase text-black">👋 Welcome</span>
            <span className="font-mono text-[13px] font-bold text-black">
              Set up your signature to get started — it goes at the bottom of every email.
            </span>
          </div>
        )}

        <section className="flex flex-col gap-5 border-4 border-black bg-white p-7 shadow-[8px_8px_0_#000]">
          {FIELDS.map((f) => (
            <Input
              key={f.key}
              id={`f-${f.key}`}
              label={f.label}
              placeholder={f.placeholder}
              value={profile[f.key] ?? ""}
              onChange={(e) => {
                setProfile({ ...profile, [f.key]: e.target.value });
                setSaved(false);
              }}
            />
          ))}
          <div className="mt-1 flex items-center gap-4">
            <Button variant="primary" onClick={save} disabled={!profile.full_name?.trim()}>
              Save
            </Button>
            {saved && (
              <span className="font-mono text-sm font-bold uppercase text-black">✅ Saved</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
