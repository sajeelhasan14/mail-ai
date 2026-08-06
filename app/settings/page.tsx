"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PersonaView from "../components/persona/PersonaView";
import PersonaForm from "../components/persona/PersonaForm";
import { Persona, EMPTY_PERSONA } from "../components/persona/types";

export default function SettingsPage() {
  const [persona, setPersona] = useState<Persona>(EMPTY_PERSONA);
  const [savedPersona, setSavedPersona] = useState<Persona>(EMPTY_PERSONA);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const p = d.profile ?? {};
        const clean: Persona = {
          full_name: p.full_name ?? "",
          title: p.title ?? "",
          company: p.company ?? "",
          phone: p.phone ?? "",
          about: p.about ?? "",
        };
        setPersona(clean);
        setSavedPersona(clean);
        setEditing(!clean.full_name);
      });
  }, []);

  const isDirty = JSON.stringify(persona) !== JSON.stringify(savedPersona);

  async function save() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(persona),
    });
    setSavedPersona(persona);
    setEditing(false);
    setSaved(true);
  }

  function cancel() {
    setPersona(savedPersona);
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-[#f4f4f0]">
      <Navbar />
      <main className="mx-auto flex max-w-[620px] flex-col gap-7 px-6 pb-24 pt-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-[44px] uppercase leading-none text-black">
            Persona
          </h1>
          <p className="font-mono text-sm text-black">
            Who you are — used to sign and personalize your emails.
          </p>
        </header>

        {editing ? (
          <PersonaForm
            persona={persona}
            onChange={setPersona}
            onSave={save}
            onCancel={cancel}
            isDirty={isDirty}
            canCancel={!!savedPersona.full_name}
          />
        ) : (
          <PersonaView persona={persona} onEdit={() => setEditing(true)} />
        )}

        {saved && !editing && (
          <span className="font-mono text-sm font-bold uppercase text-black">
            ✅ Saved
          </span>
        )}
      </main>
    </div>
  );
}
