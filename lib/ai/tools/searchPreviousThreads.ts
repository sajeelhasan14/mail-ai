import { tool } from "@openai/agents";
import { embed } from "../embed";
import { z } from "zod";
import { pool } from "@/lib/database/db";

export const searchPreviousThreads = tool({
  name: "search_previous_threads",
  description:
    "Semantically search my past emails by meaning to find related earlier conversations.",
  parameters: z.object({ query: z.string() }),
  async execute({ query }, runContext) {
    console.log("🔧 tool fired for", query);
    const context = runContext?.context as {
      userId?: string;
      recipientEmail?: string;
    };
    const userId = context?.userId;
    const recipientEmail = context?.recipientEmail;
    if (!userId) return { found: false };
    const queryVector = await embed(query);
    const { rows } = await pool.query(
      `
            SELECT subject,body,sent_at
            FROM emails
            WHERE user_id = $1
            AND recipient_email =$2
            AND embedding IS NOT NULL
            ORDER BY embedding <=> $3
            limit 3
            `,
      [userId, recipientEmail, JSON.stringify(queryVector)],
    );
    if (rows.length === 0) return { found: false };
    return {
      found: true,
      threads: rows.map((r) => ({
        subject: r.subject,
        excerpt: r.body.slice(0, 300),
      })),
    };
  },
});
