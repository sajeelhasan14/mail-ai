type EmailFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};
export default function EmailForm({
  value,
  onChange,
  onSubmit,
  loading,
}: EmailFormProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the email, e.g. 'Email sara@acme.com about tomorrow's meeting'"
        rows={4}
      />
      <button onClick={onSubmit} disabled={loading || !value}>
        {loading ? "Writing" : "Generate Email"}
      </button>
    </div>
  );
}
