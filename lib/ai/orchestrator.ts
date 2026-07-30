// THERE IS 3 TYPES OF ORCHESTRATION:
// 1: AGENT AS TOOL.
// 2: HANDOFF
// 3: ORCHESTRATION VIA CODE (using currently below)

import { run } from "@openai/agents";
import { WriterAgent } from "./agents/writer";
import { reviewerAgent } from "./agents/reviewer";

const MAX_REWRITES = 1;

export async function generateEmail(
  description: string,
  userId: string,
  recipientEmail: string,
) {
  const input = `Recipient: ${recipientEmail}\n\nTask: ${description}`;
  let draft = (
    await run(WriterAgent, input, { context: { userId, recipientEmail } })
  ).finalOutput;
  for (let i = 0; i < MAX_REWRITES; i++) {
    const review = (
      await run(
        reviewerAgent,
        `Request: ${input}\nDraft: ${JSON.stringify(draft)}`,
      )
    ).finalOutput;

    if (!review || review.approved) break;

    draft = (
      await run(
        WriterAgent,
        `${input}\nPrevious: ${JSON.stringify(draft)}\nFix: ${review.feedback}`,
        { context: { userId, recipientEmail } },
      )
    ).finalOutput;
  }
  return draft;
}

type Email = { subject: string; body: string };

export async function reviseEmail(currentEmail: Email, feedback: string) {
  const revised = (
    await run(
      WriterAgent,
      `Here is the current email:${JSON.stringify(currentEmail)}
    Rewrite it based on the instruction from the user: ${feedback}
    Return the full updated email.
    `,
    )
  ).finalOutput;
  return revised;
}
