import Input from "../ui/Input";
import Button from "../ui/Button";
import { Persona, PERSONA_FIELDS } from "./types";

type Props = {
  persona: Persona;
  onChange: (persona: Persona) => void;
  onSave: () => void;
  onCancel: () => void;
  isDirty: boolean;
  canCancel: boolean;
};

export default function PersonaForm({
  persona,
  onChange,
  onSave,
  onCancel,
  isDirty,
  canCancel,
}: Props) {
  return (
    <section className="flex flex-col gap-5 border-4 border-black bg-white p-7 shadow-[8px_8px_0_#000]">
      {PERSONA_FIELDS.map((f) => (
        <Input
          key={f.key}
          id={`f-${f.key}`}
          label={f.label}
          placeholder={f.placeholder}
          value={persona[f.key] ?? ""}
          onChange={(e) => onChange({ ...persona, [f.key]: e.target.value })}
        />
      ))}
      <div className="mt-1 flex items-center gap-4">
        <Button
          variant="primary"
          onClick={onSave}
          disabled={!isDirty || !persona.full_name.trim()}
        >
          Save
        </Button>
        {canCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {isDirty && (
          <span className="font-mono text-xs font-bold uppercase text-black/60">
            ● unsaved changes
          </span>
        )}
      </div>
    </section>
  );
}
