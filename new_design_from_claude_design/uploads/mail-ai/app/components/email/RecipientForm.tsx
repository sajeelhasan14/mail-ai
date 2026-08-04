type RecipientFormProps = {
  value: string;
  onChange: (value: string) => void;
};
export default function RecipientForm({ value, onChange }: RecipientFormProps) {
  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Recipient email (e.g. sara@acme.com)"
      style={{ width: "100%", padding: 8, marginTop: 12 }}
    />
  );
}
