import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "./components/layout/Navbar";
import EmailComposer from "./components/email/EmailComposer";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar />
      <EmailComposer />
    </div>
  );
}
