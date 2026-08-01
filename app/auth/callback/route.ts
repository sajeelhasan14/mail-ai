import { createClient } from "@/lib/supabase/server";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    const userId = data.user?.id;
    const refreshToken = data.session?.provider_refresh_token;

    // only save if we actually got one (Google returns it on consent)
    if (userId && refreshToken) {
      await pool.query(
        `insert into profiles (user_id, gmail_refresh_token)
         values ($1, $2)
         on conflict (user_id) do update set gmail_refresh_token = excluded.gmail_refresh_token`,
        [userId, refreshToken],
      );
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
