import { createClient } from "@/lib/supabase/server";
import { pool } from "@/lib/database/db";
import { getProfile } from "@/lib/database/profile";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(user.id);
  return Response.json({ profile });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { full_name, phone, title, company } = await request.json();
  await pool.query(
    `
        INSERT INTO profiles (user_id,full_name,phone,title,company)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (user_id)
        DO UPDATE
        SET
            full_name = excluded.full_name,
            phone = excluded.phone,
            title = excluded.title,
            company = excluded.company
            `,
    [user.id, full_name ?? null, phone ?? null, title ?? null, company ?? null],
  );
  return Response.json({ ok: true });
}
