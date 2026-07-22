import { pool } from "@/lib/database/db";

export async function GET() {
  const { rows } = await pool.query("select now()");
  return Response.json({ ok: true, time: rows[0].now });
}
