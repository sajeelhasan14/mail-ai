"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes:
          "https://www.googleapis.com/auth/gmail.readonly " +
          "https://www.googleapis.com/auth/gmail.send",

        queryParams: { access_type: "offline", prompt: "consent" },
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f4f0] p-6 [background-image:repeating-linear-gradient(0deg,transparent,transparent_47px,#00000012_47px,#00000012_48px)]">
      <div className="flex w-full max-w-[420px] flex-col border-4 border-black bg-white shadow-[10px_10px_0_#000]">
        <div className="flex flex-col gap-3 border-b-4 border-black bg-[#00d95f] px-7 pb-6 pt-7">
          <span className="grid h-12 w-12 place-items-center border-[3px] border-black bg-[#f8e800] font-heading text-[28px] leading-none text-black shadow-[4px_4px_0_#000]">
            @
          </span>
          <h1 className="font-heading text-[40px] uppercase leading-none tracking-tighter text-black">
            Mail-AI
          </h1>
          <p className="font-mono text-[13px] font-bold uppercase tracking-wide text-black">
            You brief. Agents write. You send.
          </p>
        </div>
        <div className="flex flex-col gap-5 p-7">
          <p className="font-mono text-sm leading-relaxed text-black">
            Sign in to draft emails with AI and send them from your own Gmail.
            Nothing sends without your approval.
          </p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 border-[3px] border-black bg-[#f4f4f0] px-5 py-4 font-heading text-[15px] uppercase text-black shadow-[6px_6px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#00d95f]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.57.38-2.29v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.61l4 3.1C6.23 6.88 8.88 4.77 12 4.77z"
              />
            </svg>
            Sign in with Google
          </button>
          <p className="border-t-2 border-black pt-3.5 font-mono text-[11px] uppercase tracking-wide text-black">
            Read-only Gmail access ▸ used to match your writing style
          </p>
        </div>
      </div>
    </div>
  );
}
