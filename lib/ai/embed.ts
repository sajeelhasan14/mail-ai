import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
const EMBED_MODEL = "gemini-embedding-001";
export const EMBED_DIM = 768;

export async function embed(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: EMBED_MODEL,
    input: text,
    dimensions: EMBED_DIM,
  });
  return res.data[0].embedding;
}
