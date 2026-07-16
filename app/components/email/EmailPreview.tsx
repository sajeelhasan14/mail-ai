type Email = { subject: string; body: string };

export default function EmailPreview({ email }: { email: Email }) {
  return (
    <div style={{ marginTop: 20, padding: 16, border: "1px solid #ccc" }}>
      <p><strong>Subject:</strong> {email.subject}</p>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{email.body}</pre>
    </div>
  );
}
