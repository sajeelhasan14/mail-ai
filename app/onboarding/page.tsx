"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

type Profile = {
  full_name: string;
  title: string;
  company: string;
  phone: string;
  about: string;
};

const FIELDS: { key: keyof Profile; label: string; placeholder: string }[] = [
  { key: "full_name", label: "Full name", placeholder: "Alex Rivera" },
  {
    key: "title",
    label: "Job title",
    placeholder: "Software Engineering Student",
  },
  {
    key: "company",
    label: "Company / School",
    placeholder: "University of Karachi",
  },
  { key: "phone", label: "Phone", placeholder: "(555) 010-4432" },
  {
    key: "about",
    label: "About you",
    placeholder: "e.g. Looking for internships, built a SaaS with Next.js…",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    title: "",
    company: "",
    phone: "",
    about: "",
  });

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const u = data.user;
        setAvatar(u?.user_metadata?.avatar_url ?? null);
        const googleName =
          u?.user_metadata?.full_name ?? u?.user_metadata?.name ?? "";
        setFirstName(googleName.split(" ")[0] ?? "");
        setProfile((p) => ({ ...p, full_name: googleName })); // pre-fill their name
      });
  }, []);

  async function save() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    router.push("/");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f4f0] p-6">
      <div className="w-full max-w-140 border-4 border-black bg-white shadow-[10px_10px_0_#000]">
        <div className="flex items-center gap-4 border-b-4 border-black bg-[#00d95f] px-7 py-6">
          {avatar && (
            <img
              src={avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-14 w-14 border-[3px] border-black object-cover shadow-[4px_4px_0_#000]"
            />
          )}
          <div>
            <h1 className="font-heading text-[26px] uppercase leading-none text-black">
              Welcome{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="font-mono text-[12px] font-bold uppercase text-black">
              Set up your profile to start
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-7">
          <p className="font-mono text-sm text-black">
            This signs your emails and gives the agent context about you. You
            can change it anytime in Settings.
          </p>
          {FIELDS.map((f) => (
            <Input
              key={f.key}
              id={`o-${f.key}`}
              label={f.label}
              placeholder={f.placeholder}
              value={profile[f.key] ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, [f.key]: e.target.value })
              }
            />
          ))}
          <Button
            variant="primary"
            onClick={save}
            disabled={!profile.full_name.trim()}
          >
            Get started ▸
          </Button>
        </div>
      </div>
    </div>
  );
}
