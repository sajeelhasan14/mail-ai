// THERE IS 3 TYPES OF ORCHESTRATION:
// 1: AGENT AS TOOL.
// 2: HANDOFF
// 3: ORCHESTRATION VIA CODE (using currently below)

import {
  run,
  Agent,
  type AgentOutputType,
  type NonStreamRunOptions,
} from "@openai/agents";
import { MODELS } from "./setup";
import { WriterAgent } from "./agents/writer";
import { reviewerAgent } from "./agents/reviewer";

const MAX_REWRITES = 1;

// 503 = model overloaded, 429 = quota used up for this model, 500 = Google-side error.
const FALLBACK_STATUSES = [429, 500, 503];

async function runWithFallback<TContext, TOutput extends AgentOutputType>(
  agent: Agent<TContext, TOutput>,
  input: string,
  options?: NonStreamRunOptions<TContext, Agent<TContext, TOutput>>,
) {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      return await run(agent.clone({ model }), input, options);
    } catch (err: any) {
      if (!FALLBACK_STATUSES.includes(err?.status)) throw err;
      console.warn(`[AI] ${model} failed with ${err.status}, trying next model...`);
      lastError = err;
    }
  }

  throw lastError;
}


export async function generateEmail(
  description: string,
  userId: string,
  recipientEmail: string,
  profile: string,
) {
  const input = `Sender profile: ${JSON.stringify(profile)}\n\nRecipient: ${recipientEmail}\n\nTask: ${description}`;
  let draft = (
    await runWithFallback(WriterAgent, input, {
      context: { userId, recipientEmail },
    })
  ).finalOutput;
  for (let i = 0; i < MAX_REWRITES; i++) {
    const review = (
      await runWithFallback(
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
