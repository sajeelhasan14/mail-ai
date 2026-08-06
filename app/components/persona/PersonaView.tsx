import { Persona, PERSONA_FIELDS } from "./types";

type Props = { persona: Persona; onEdit: () => void };

export default function PersonaView({ persona, onEdit }: Props) {
  return (
    <section className="border-4 border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="flex items-center justify-between border-b-4 border-black bg-[#00d95f] px-5 py-3">
        <span className="font-heading text-base uppercase text-black">
          Your details
        </span>
        <button
          onClick={onEdit}
          className="border-[3px] border-black bg-[#f8e800] px-4 py-1.5 font-mono text-xs font-bold uppercase text-black shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#000]"
        >
          Edit
        </button>
      </div>
      <dl className="flex flex-col">
        {PERSONA_FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex gap-4 border-b-[3px] border-black px-5 py-3.5 last:border-b-0"
          >
            <dt className="w-24 shrink-0 font-mono text-[11px] font-bold uppercase text-black/50">
              {f.label}
            </dt>
            <dd className="whitespace-pre-wrap font-mono text-sm text-black">
              {persona[f.key] || <span className="text-black/30">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
