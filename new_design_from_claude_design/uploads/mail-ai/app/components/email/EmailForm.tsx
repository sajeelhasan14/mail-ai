type EmailFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  placeholder: string;
  submitlabel: string;
};
export default function EmailForm({
  value,
  onChange,
  onSubmit,
  loading,
  placeholder,
  submitlabel
}: EmailFormProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
      <button onClick={onSubmit} disabled={loading || !value}>
        {loading ? "Writing" : submitlabel}
      </button>
    </div>
  );
}
