import { generateEmail } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  const { input } = await request.json();
  if (!input) {
    return Response.json(
      { error: "Description is required to continue" },
      { status: 400 },
    );
  }
  const email = await generateEmail(input);
  console.log(email);
  return Response.json({ email });
}
