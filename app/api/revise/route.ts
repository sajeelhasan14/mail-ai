import { reviseEmail } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  const { email, feedback } = await request.json();
  if (!email || !feedback) {
    return Response.json(
      { error: "Both email and feedback are required" },
      { status: 400 },
    );
  }
  const revised = await reviseEmail(email, feedback);
  return Response.json({ email: revised });
}
