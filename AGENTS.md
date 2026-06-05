<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:icon-rule -->
# Rule: NEVER use emoji as icons in the UI

**Authority:** Gedeon (CEO), 2026-05-28. Non-negotiable, permanent.

## The rule

Every icon rendered in a React component MUST use `lucide-react`.
Emoji characters (📉 💸 🏥 ⚕ ✓ ✅ 🎉 etc.) are PROHIBITED as icons inside
the JSX of any visitor-facing or internal-tool page in this repo.

## Why

Emoji are full-color raster glyphs. Their rendering box has subtle
antialiasing transparency that bleeds against dark gradients and
brand backgrounds, producing "halos" or "scribble" artifacts that
read as AI-generated junk to viewers. The effect is browser-/OS-
agnostic — no amount of styling fixes it. We hit this in production
on `/employers` problem-cards (commit `1cca584`) and swept the rest
of the site in commit `20aa887` (7 files, 17 icons). Don't re-introduce
the problem.

## Do this

```tsx
import { CheckCircle2 } from 'lucide-react';

<div className="success-icon" style={{ color: '#22c55e' }}>
  <CheckCircle2 size={24} strokeWidth={1.75} />
</div>
```

## Don't do this

```tsx
// ❌ FORBIDDEN — emoji-as-icon
<div className="success-icon">✅</div>
<p style={{ fontSize: 32 }}>🎉</p>
<div className="logo-glyph">⚕</div>
```

## Patterns and replacements (canonical)

| Emoji you're tempted to use | Lucide replacement |
|---|---|
| 📉 down trend | `TrendingDown` |
| 📈 up trend | `TrendingUp` |
| 💸 💰 money/cost | `Coins`, `DollarSign`, `Banknote` |
| 🏥 ⚕ clinic/medical | `Stethoscope`, `HeartPulse` |
| 💬 chat/SMS | `MessageSquare`, `MessageCircle` |
| 🚨 ⚠️ alert | `BellRing`, `AlertTriangle` |
| 📊 analytics | `BarChart3`, `LineChart` |
| ⚖️ compliance/balance | `Scale`, `ShieldCheck` |
| ✅ ✓ success/checkmark | `CheckCircle2`, `Check` |
| ❌ ✗ error | `XCircle`, `X` |
| 🔐 🔒 lock | `Lock`, `ShieldCheck` |
| 🎉 celebration | `PartyPopper`, `Sparkles` |
| 👥 people/users | `Users` |
| 🖥️ desktop/computer | `Monitor` |
| 📱 phone | `Smartphone` |

If you need a glyph not in this table, check
https://lucide.dev/icons — there are ~1,500 options, the right
one almost always exists.

## Styling pattern (matches existing TrustBar.tsx / Footer.tsx)

- Use `size={N}` not `fontSize` on the wrapper. Default `size={24}`,
  `strokeWidth={1.75}` for general use; `size={16}` for inline / chip
  contexts; `size={48}+` for hero / success states.
- Color via `color="..."` prop OR CSS `color:` on a parent — Lucide
  inherits `currentColor`. For sky-blue accent: `color: var(--sky)`
  (or `#27AAE1` if not in scope). For success: `#22c55e`. For brand
  glyphs in gradient boxes: `color: 'white'`.
- For icons inside brand-gradient boxes (the `⚕`-style logo glyph),
  KEEP the gradient container; only swap the emoji for `<Stethoscope />`
  with `color: 'white'`. Don't redesign the chip.

## Exceptions (the only ones)

Emoji is **PERMITTED** in these contexts because they render in
non-DOM channels where the halo issue doesn't apply:

1. **Slack message blocks** — `src/lib/slack.ts` and all `/api/*`
   routes that POST to Slack webhooks. Slack renders emoji natively
   in messages. Keep the existing 🎉 🚪 ⚠️ 🚨 💳 🏢 patterns.
2. **SMS message templates** — `src/lib/carepath-messages.ts` and
   any other text content delivered via Twilio. Carriers pass emoji
   through cleanly; recipients see them as system emoji on their
   own device.
3. **README / docs / commit messages** — markdown context, not UI.

If you're not sure whether your context counts as "UI", default to
the rule: use Lucide.

## Enforcement

- Code review: every PR that touches `.tsx` files gets a quick visual
  scan for emoji-as-icon. Hard reject if found outside the exceptions.
- Optional future hardening: add an ESLint rule that flags
  high-Unicode characters inside JSX children. Not implemented yet;
  add if recurrence becomes a pattern.
- Historical commits that triggered this rule: `1cca584` (initial fix),
  `20aa887` (full sweep).
<!-- END:icon-rule -->
