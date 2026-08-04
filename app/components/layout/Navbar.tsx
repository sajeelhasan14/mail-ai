"use client";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    location.href = "/login";
  }
  return (
    <nav className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b-4 border-black bg-[#f4f4f0] px-6">
      <Link href="/" className="flex items-center gap-3.5 no-underline">
        <span className="grid h-10 w-10 place-items-center border-[3px] border-black bg-[#00d95f] font-heading text-[22px] leading-none text-black shadow-[4px_4px_0_#000]">
          @
        </span>
        <span className="font-heading text-[26px] uppercase tracking-tight text-black">Mail-AI</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="font-mono text-sm font-bold uppercase text-black underline decoration-[3px] underline-offset-4 hover:text-[#00d95f]"
        >
          Settings
        </Link>
        <button
          onClick={signOut}
          className="border-[3px] border-black bg-[#f4f4f0] px-4 py-2 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#00d95f]"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
