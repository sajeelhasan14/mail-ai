import { generateEmail } from "@/lib/ai/orchestrator";


export async function POST(request: Request) {
  const { description } = await request.json();
  if (!description) {
    return Response.json(
      { error: "Description is required to continue" },
      { status: 400 },
    );
  }
  const email = await generateEmail(description);
  return Response.json(email);
}
