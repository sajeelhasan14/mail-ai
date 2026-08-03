import { pool } from "@/lib/database/db";
import { tool } from "@openai/agents";
import { z } from "zod";

export const lookupRecipientContext = tool({
  name: "lookup_recipient_context",
  description:
    "Find past emails to this recipient to match the tone you usually use.",
  parameters: z.object({ email: z.string() }),
  async execute({ email }, runContext) {
    console.log("🔧 tool for tone fired for", email);
    const userId = (runContext?.context as { userId?: string })?.userId;
    if (!userId) return { known: false };
    const { rows } = await pool.query(
      `
            SELECT subject,tone,sent_at
            FROM emails
            WHERE user_id = $1 AND recipient_email = $2
            ORDER BY sent_at DESC
            LIMIT 5
            `,
      [userId, email],
    );
    if (rows.length === 0) return { known: false };
    console.log(rows[0].tone);
    return {
      known: true,
      count: rows.length,
      lastTone: rows[0].tone,
      recentSubjects: rows.map((r) => r.subject),
    };
  },
});
