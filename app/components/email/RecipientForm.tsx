import Input from "../ui/Input";

type RecipientFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RecipientForm({ value, onChange }: RecipientFormProps) {
  return (
    <Input
      id="to-input"
      type="email"
      label="To ▸ recipient email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="sara@acme.com"
    />
  );
}
