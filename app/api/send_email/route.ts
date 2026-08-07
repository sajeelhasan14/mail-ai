import { embed } from "@/lib/ai/embed";
import { pool } from "@/lib/database/db";
import { sendEmail } from "@/lib/mailer/mailer";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // seconds

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
  const from = user.email;

  const { rows } = await pool.query(
    `
    SELECT gmail_refresh_token
    FROM profile
    WHERE user_id = $!,
    `,
    [userId],
  );
  const refreshToken = rows[0]?.gmail_refresh_token;
  if (!from || !refreshToken) {
    return Response.json(
      {
        error:
          "Gmail not connected — sign out and back in to grant send access.",
      },
      { status: 400 },
    );
  }

  const { to, subject, body, tone } = await request.json();
  if (!to || !subject || !body) {
    return Response.json(
      { error: "to, subject, and body are required" },
      { status: 400 },
    );
  }
  const messageId = await sendEmail(from, refreshToken, to, subject, body);
  let embedding: number[] | null = null;
  try {
    embedding = await embed(`${subject}\n\n${body}`);
  } catch (e) {
    console.error("embedding failed,saving without it:", e);
  }
  await pool.query(
    `
    INSERT INTO emails (user_id, recipient_email, subject, body, tone, embedding)
    VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      userId,
      to,
      subject,
      body,
      tone ?? null,
      embedding ? JSON.stringify(embedding) : null,
    ],
  );
  return Response.json({ ok: true, messageId });
}
