import { Agent } from "@openai/agents";
import { z } from "zod";

import { MODEL } from "../setup";

export const emailSchema = z.object({
  subject: z.string().describe("The subject line of the email"),
  body: z.string().describe("The body of the email"),
  tone: z
    .enum(["professional", "friendly", "casual", "angry", "frustrated"])
    .describe("The tone used in the email"),
});

export const WriterAgent = new Agent({
  name: "Email Writer",
  instructions:
    "You write professional emails from a short description of the email's purpose.",
  model: MODEL,
  outputType: emailSchema,
});
