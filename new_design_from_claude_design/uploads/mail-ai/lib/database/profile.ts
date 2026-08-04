import { pool } from "./db";

export type profile = {
  full_name?: string;
  phone?: String;
  title?: string;
  company?: string;
};

export async function getProfile(userId: string) {
  const { rows } = await pool.query(
    `
        SELECT full_name,phone,title,company
        FROM profiles
        WHERE user_id = $1
        `,
    [userId],
  );
  return rows[0] ?? {};
}
