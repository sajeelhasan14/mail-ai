import { reviseEmail } from "@/lib/ai/orchestrator";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // seconds

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, feedback } = body;
  if (!email || !feedback) {
    return Response.json(
      { error: "Both email and feedback are required" },
      { status: 400 },
    );
  }

  try {
    const revised = await reviseEmail(email, feedback);
    return Response.json({ email: revised });
  } catch (err: any) {
    console.error(err);
    if (err?.status === 503 || err?.status === 429) {
      return Response.json(
        { error: "AI is busy right now, please try again in a moment." },
        { status: 503 },
      );
    }
    return Response.json({ error: "Failed to revise email" }, { status: 500 });
  }
}
