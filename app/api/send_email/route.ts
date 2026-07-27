import { pool } from "@/lib/database/db";
import { sendEmail } from "@/lib/mailer/mailer";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  // user ki uuid from supabase
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  

  if (error || !user) {
   
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  const { to, subject, body, tone } = await request.json();
  if (!to || !subject || !body) {
    return Response.json(
      { error: "to, subject, and body are required" },
      { status: 400 },
    );
  }
  const messageId = await sendEmail(to, subject, body);
  await pool.query(
    `
    INSERT INTO emails (user_id, recipient_email, subject, body, tone)
    VALUES ($1,$2,$3,$4,$5)`,
    [userId, to, subject, body, tone ?? null],
  );
  return Response.json({ ok: true, messageId });
}
