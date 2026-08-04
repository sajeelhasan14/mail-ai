import { Agent } from "@openai/agents";
import { z } from "zod";
import { MODEL } from "../setup";

const reviewSchema = z.object({
  approved: z.boolean().describe("Whether the email is approved or not"),
  feedback: z
    .string()
    .describe(
      "Feedback for the writer agent what to change and fix if not approved",
    ),
});

export const reviewerAgent = new Agent({
  name: "Email Reviewer",
  instructions: `You are a strict but fair email editor.

Check: is the tone right? Is the subject clear? Does it fully
answer the request? Are there any contradictions?
If it is good, set approved = true.
Otherwise set approved = false and give specific, short feedback.`,
  model: MODEL,
  outputType: reviewSchema,
});
