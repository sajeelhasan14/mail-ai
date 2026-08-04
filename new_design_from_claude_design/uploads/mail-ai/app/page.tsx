import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "./components/layout/Navbar";
import EmailComposer from "./components/email/EmailComposer";
import { getProfile } from "@/lib/database/profile";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }
  const profile = await getProfile(data.claims.sub);
  if (!profile.full_name) redirect("/settings");

  return (
    <div>
      <Navbar />
      <EmailComposer />
    </div>
  );
}
