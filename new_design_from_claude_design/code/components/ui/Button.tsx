import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "accent" | "secondary";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base =
  "border-[3px] border-black uppercase cursor-pointer select-none " +
  "shadow-[6px_6px_0_#000] transition-none " +
  "enabled:hover:translate-x-[3px] enabled:hover:translate-y-[3px] enabled:hover:shadow-[3px_3px_0_#000] " +
  "enabled:active:translate-x-[6px] enabled:active:translate-y-[6px] enabled:active:shadow-none " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#00d95f] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-[#00d95f] text-black font-heading text-base px-7 py-3.5",
  accent: "bg-[#f8e800] text-black font-heading text-lg px-8 py-4",
  secondary: "bg-[#f4f4f0] text-black font-mono font-bold text-sm px-6 py-4",
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
