import { tool } from "@openai/agents";
import { pool } from "@/lib/database/db";
import { getGmailClient } from "@/lib/gmail";
import { z } from "zod";

export const lookupGmailHistory = tool({
  name: "lookup_gmail_history",
  description:
    "Look up REAL past Gmail messages with the recipient (their replies and your emails) to ground the email in actual history.",

  parameters: z.object({
    query: z
      .string()
      .describe("Optional keywords to narrow the search, or an empty string"),
  }),
    async execute({ query }, runContext) {
      console.log("🔧 lookup Gmail tool fired ");
    const context = runContext?.context as {
      userId?: string;
      recipientEmail?: string;
    };
    const userId = context?.userId;
    const recipientEmail = context?.recipientEmail;
    if (!userId || !recipientEmail) return { found: false };

    const { rows } = await pool.query(
      `
            SELECT gmail_refresh_token
            FROM profiles
            WHERE user_id = $1
            `,
      [userId],
    );
    const refreshToken = rows[0]?.gmail_refresh_token;
    if (!refreshToken) return { found: false, reason: "gmail not connected" };

    try {
      const gmail = getGmailClient(refreshToken);

      // 2. search messages to/from this recipient
      const q =
        `(from:${recipientEmail} OR to:${recipientEmail}) ${query}`.trim();
      const list = await gmail.users.messages.list({
        userId: "me",
        q,
        maxResults: 5,
      });
      if (!list.data.messages?.length) return { found: false };

      // 3. fetch a subject + snippet for each
      const threads = [];
      for (const m of list.data.messages) {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: m.id!,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });
        const subject =
          msg.data.payload?.headers?.find((h) => h.name === "Subject")?.value ??
          "(no subject)";
        threads.push({ subject, snippet: msg.data.snippet ?? "" });
      }

      return { found: true, threads };
    } catch (e) {
      console.error("gmail lookup failed:", e);
      return { found: false }; // never crash the email over a Gmail hiccup
    }
  },
});
