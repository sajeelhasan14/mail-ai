import { createClient } from "@/lib/supabase/server";
import { pool } from "@/lib/database/db";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `
        SELECT full_name, phone,title,company
        FROM profiles
        WHERE user_id = $1
        `,
    [user.id],
    );
    return Response.json({profile:rows[0] ?? {}})
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })
    
    const { full_name, phone, title, company } = await request.json();
    await pool.query(
        `
        INSERT INTO profiles (user_id,full_name,phone,title,company)
        VALUES ($1,$2,$3,$4,$5)`
    )
}