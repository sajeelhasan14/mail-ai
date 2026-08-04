import { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export default function Textarea({ label, id, className = "", ...props }: Props) {
  const field = (
    <textarea
      id={id}
      className={
        "w-full resize-y border-[3px] border-black bg-white px-4 py-3.5 font-mono text-base text-black " +
        "shadow-[5px_5px_0_#000] placeholder:text-black/40 " +
        "focus:outline focus:outline-[3px] focus:-outline-offset-[3px] focus:outline-[#00d95f] " +
        className
      }
      {...props}
    />
  );
  if (!label) return field;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-xs font-bold uppercase tracking-widest text-black">
        {label}
      </label>
      {field}
    </div>
  );
}
