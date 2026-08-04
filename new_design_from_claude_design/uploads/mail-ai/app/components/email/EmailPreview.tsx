import { Email } from "./types";
export default function EmailPreview({
  email,
  onChange,
}: {
  email: Email;
  onChange: (updated: Email) => void;
}) {
  return (
    <div style={{ marginTop: 20, padding: 16, border: "1px solid #ccc" }}>
      <input
        value={email.subject}
        onChange={(e) => onChange({ ...email, subject: e.target.value })}
        style={{
          width: "100%",
          fontWeight: "bold",
          marginBottom: 8,
          padding: 6,
        }}
      />
      <textarea
        value={email.body}
        onChange={(e) => onChange({ ...email, body: e.target.value })}
        rows={12}
        style={{ width: "100%", padding: 6, fontFamily: "inherit" }}
      />
    </div>
  );
}
