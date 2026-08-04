import { Email } from "./types";

export default function EmailPreview({
  email,
  onChange,
}: {
  email: Email;
  onChange: (updated: Email) => void;
}) {
  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0_#000]">
      <div className="flex items-center justify-between border-b-4 border-black bg-[#f8e800] px-4 py-2.5">
        <span className="font-heading text-sm uppercase text-black">Draft — edit anything</span>
        <span className="border-2 border-black bg-[#1a3cff] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-white">
          tone: {email.tone}
        </span>
      </div>
      <div className="flex items-stretch border-b-[3px] border-black">
        <label
          htmlFor="subject-input"
          className="flex items-center border-r-[3px] border-black bg-[#f4f4f0] px-3 font-mono text-[11px] font-bold uppercase text-black"
        >
          Subj
        </label>
        <input
          id="subject-input"
          aria-label="Email subject"
          value={email.subject}
          onChange={(e) => onChange({ ...email, subject: e.target.value })}
          className="min-w-0 flex-1 bg-white px-4 py-3.5 font-mono text-base font-bold text-black focus:outline focus:outline-[3px] focus:-outline-offset-[3px] focus:outline-[#ff2e88]"
        />
      </div>
      <textarea
        id="body-input"
        aria-label="Email body"
        rows={14}
        value={email.body}
        onChange={(e) => onChange({ ...email, body: e.target.value })}
        className="block w-full resize-y bg-white p-4 font-mono text-[15px] leading-relaxed text-black focus:outline focus:outline-[3px] focus:-outline-offset-[3px] focus:outline-[#ff2e88]"
      />
    </div>
  );
}
