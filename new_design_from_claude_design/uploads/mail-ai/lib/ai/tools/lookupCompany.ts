import { tool } from "@openai/agents";
import { z } from "zod";
import { searchWeb } from "@/lib/web_search";

const PERSONAL = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
];

export const lookupCompany = tool({
  name: "lookup_company",
  description:
    "Look up what a company does from its email domain (e.g. acme.com). Use only for business domains, not personal ones like gmail.com.",
  parameters: z.object({
    domain: z.string().describe("The recipient's email domain, e.g. acme.com"),
  }),
  async execute({ domain }) {
    console.log("lookup company tool fired");
    // skip personal domains — there's no company to look up
    if (PERSONAL.includes(domain.toLowerCase()))
      return { found: false, reason: "personal domain" };

    try {
      const info = await searchWeb(`What does the company at ${domain} do?`);
      return info ? { found: true, info } : { found: false };
    } catch (e) {
      console.error("company lookup failed:", e);
      return { found: false }; // never crash the email over a search hiccup
    }
  },
});
