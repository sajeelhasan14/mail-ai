import Button from "../ui/Button";
import Textarea from "../ui/Textarea";

type EmailFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  placeholder: string;
  submitlabel: string;
  label: string;
};

export default function EmailForm({
  value,
  onChange,
  onSubmit,
  loading,
  placeholder,
  submitlabel,
  label,
}: EmailFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        id="prompt-input"
        label={label}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
        }}
      />
      <div className="mt-2 flex items-center gap-4">
        <Button variant="primary" onClick={onSubmit} disabled={loading || !value.trim()}>
          {loading ? "Writing…" : submitlabel}
        </Button>
        {loading && (
          <span className="animate-pulse font-mono text-[13px] font-bold uppercase text-black">
            ▮ agents working
          </span>
        )}
      </div>
    </div>
  );
}
