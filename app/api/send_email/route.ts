import { sendEmail } from "@/lib/mailer/mailer";


export async function POST(request: Request) {
  const { to, subject, body } = await request.json();
  if (!to || !subject || !body) {
    return Response.json(
      { error: "to, subject, and body are required" },
      { status: 400 },
    );
  }
  const messageId = await sendEmail(to, body, subject);
  return Response.json({ ok: true, messageId });
}
