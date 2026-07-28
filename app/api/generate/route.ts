import { generateEmail } from "@/lib/ai/orchestrator";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { input, to } = await request.json();
  if (!input) {
    return Response.json(
      { error: "Description is required to continue" },
      { status: 400 },
    );
  }
  try {
    const email = await generateEmail(input, user.id, to ?? "");
    return Response.json({ email });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to generate email" },
      { status: 500 },
    );
  }
}
