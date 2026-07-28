import { Agent } from "@openai/agents";
import { z } from "zod";

import { MODEL } from "../setup";
import { lookupRecipientContext } from "../tools/lookupRecipientContext";

export const emailSchema = z.object({
  subject: z.string().describe("The subject line of the email"),
  body: z.string().describe("The body of the email"),
  tone: z
    .enum(["professional", "friendly", "casual", "angry", "frustrated"])
    .describe("The tone used in the email"),
});

export const WriterAgent = new Agent({
  name: "Email Writer",
  instructions: `You write professional emails from a short description of the email's purpose.

Before writing, call the lookup_recipient_context tool with the recipient's email address to check past emails to that person.
- If there is history (known: true), match the tone you usually use with them.
- If there is no history (known: false), just write normally.`,
  model: MODEL,
  tools: [lookupRecipientContext],
  outputType: emailSchema,
});
