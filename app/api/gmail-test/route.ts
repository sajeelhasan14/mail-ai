import { createClient } from "@/lib/supabase/server";
import { pool } from "@/lib/database/db";
import { getGmailClient } from "@/lib/gmail";

export async function GET(request: Request) {
  const to = new URL(request.url).searchParams.get("to");
  if (!to)
    return Response.json(
      { error: "add ?to=email@example.com" },
      { status: 400 },
    );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "not signed in" }, { status: 401 });

  const { rows } = await pool.query(
    `select gmail_refresh_token from profiles where user_id = $1`,
    [user.id],
  );
  const refreshToken = rows[0]?.gmail_refresh_token;
  if (!refreshToken)
    return Response.json({ error: "no gmail token in profiles" });

  const gmail = getGmailClient(refreshToken);
  const list = await gmail.users.messages.list({
    userId: "me",
    q: `(from:${to} OR to:${to})`,
    maxResults: 5,
  });

  const threads = [];
  for (const m of list.data.messages ?? []) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: m.id!,
      format: "metadata",
      metadataHeaders: ["Subject"],
    });
    const subject =
      msg.data.payload?.headers?.find((h) => h.name === "Subject")?.value ??
      "(no subject)";
    threads.push({ subject, snippet: msg.data.snippet });
  }

  return Response.json({ count: threads.length, threads });
}
