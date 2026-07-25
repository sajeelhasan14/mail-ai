"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <h1>AI Email Agent</h1>
      <p>Sign in to start writing emails.</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
