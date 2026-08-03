import { tool } from "@openai/agents";
import { embed } from "../embed";
import { z } from "zod";
import { pool } from "@/lib/database/db";

export const findMyTemplate = tool({
  name: "find_my_template",
  description:
    "Find one of MY past sent emails to reuse as a style/structure template. ONLY use when the user explicitly asks to reuse or mirror a previous email (e.g. 'like my usual pitch', 'the way I wrote to Bob').",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "A short phrase describing the kind of email to reuse, e.g. 'pricing pitch'",
      ),
  }),
  async execute({ query }, runContext) {
    console.log("tool fired: Find My Template")
    const userId = (runContext?.context as { userId?: string }).userId;
    if (!userId) return { found: false };
    const queryVector = await embed(query);
    const { rows } = await pool.query(
      `
            SELECT subject,body
            FROM emails
            WHERE user_id = $1 AND embedding IS NOT NULL
            ORDER BY embeddings <=> $2
            LIMIT 1
            `,
      [userId, JSON.stringify(queryVector)],
    );
    if (rows.length === 0) return { found: false };
    return {
      found: true,
      template: { subject: rows[0].subject, body: rows[0].body },
    };
  },
});
