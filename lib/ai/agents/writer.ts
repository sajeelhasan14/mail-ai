import { Agent } from "@openai/agents";
import { z } from "zod";
import { MODEL } from "../setup";

export const WriterAgent = new Agent({
  name: "Email Writer",
  instructions:
    "You write professional emails from a short description of the email's purpose.",
  model: MODEL,
});
