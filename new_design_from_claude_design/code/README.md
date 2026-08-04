# Mail-AI — brutalist UI drop-in

Files mirror your structure under `app/`:

- `components/ui/` → Button.tsx, Input.tsx, Textarea.tsx
- `components/email/` → EmailComposer.tsx, EmailForm.tsx, EmailPreview.tsx, RecipientForm.tsx
- `components/layout/` → Navbar.tsx
- `app/(auth)/login/page.tsx`, `app/settings/page.tsx`

## Setup (2 steps)

1. **Fonts** — in `app/layout.tsx`:

```tsx
import { Archivo_Black, Space_Mono } from "next/font/google";

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

// on <body>: className={`${archivo.variable} ${spaceMono.variable}`}
```

2. **globals.css** (Tailwind v4):

```css
@theme inline {
  --font-heading: var(--font-archivo);
  --font-mono: var(--font-space-mono);
}
body { background: #f4f4f0; }
::selection { background: #f8e800; }
```

## Tokens

- Background `#f4f4f0` · Text `#000` · Green `#00d95f` (primary actions) · Yellow `#f8e800` (send / banners / highlights) · Blue `#1a3cff` (small accents: badges, label arrows)
- Borders: 3px (controls) / 4px (cards, navbar). Shadows: hard offset only (`shadow-[6px_6px_0_#000]`).
- Press effect: hover translate(3px,3px) + shadow 3px; active translate(6px,6px) + no shadow.

## API changes vs your current code

- `EmailForm` gained a required `label` prop (the monospace field label). `submitlabel` kept as-is.
- `EmailComposer` now renders the page `<main>` (heading included) and replaces `alert()` with an inline error banner.
- `Navbar` is now a client component (Supabase sign-out + Settings link).
- `app/page.tsx` needs no changes beyond wrapping in `<div className="min-h-screen bg-[#f4f4f0]">`.
