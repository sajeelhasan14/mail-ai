// THERE IS 3 TYPES OF ORCHESTRATION:
// 1: AGENT AS TOOL.
// 2: HANDOFF
// 3: ORCHESTRATION VIA CODE (using currently below)

import { run } from "@openai/agents";
import { WriterAgent } from "./agents/writer";
import { reviewerAgent } from "./agents/reviewer";

const MAX_REWRITES = 2;

export async function generateEmail(description: string) {
  let draft = (await run(WriterAgent, description)).finalOutput;
  for (let i = 0; i < MAX_REWRITES; i++) {
    const review = (
      await run(
        reviewerAgent,
        `Request: ${description}\nDraft: ${JSON.stringify(draft)}`,
      )
    ).finalOutput;

    if (!review || review.approved) break;

    draft = (
      await run(
        WriterAgent,
        `${description}\nPrevious: ${JSON.stringify(draft)}\nFix: ${review.feedback}`,
      )
    ).finalOutput;
  }
  return draft;
}


