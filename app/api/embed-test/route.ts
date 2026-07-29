import { embed } from "@/lib/ai/embed";

export async function GET() {
  const v = await embed("hello world");
  return Response.json({ length: v.length });
}
