import { OpenAI } from "openai";
import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from "@openai/agents";

// 1. An OpenAI client pointed at Gemini's OpenAI-compatible endpoint.
const externalClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// 2. Make it the default client every agent uses.
setDefaultOpenAIClient(externalClient);

// 3. Gemini speaks the "chat completions" format, not the Responses API.
setOpenAIAPI("chat_completions");

// 4. Tracing is an OpenAI-only feature — turn it off so it doesn't error.
setTracingDisabled(true);

/**
 * Single source of truth for the model name. Agents import this instead of
 * hardcoding the string, so you change the model in one place.
 *
 * Note: the Writer agent uses tools + structured output together, which older
 * Gemini 2.x models can't do at once. Use a newer model if tool calls misbehave.
 */
export const MODEL = "gemini-2.5-flash";
