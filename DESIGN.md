# Design

## Color Strategy

**Restrained** for portal/product surfaces (tinted neutrals + sky accent).
**Committed** for brand/marketing surfaces (navy carries 60%+ of the page surface).

### Palette

| Token | Value | Usage |
|---|---|---|
| `--navy-d` | `#1a1740` | Page background (marketing) |
| `--navy` | `#262262` | Primary brand navy |
| `--navy-l` | `#2e2a78` | Elevated surfaces, hover states |
| `--sky` | `#27AAE1` | Primary accent — links, CTAs, active indicators |
| `--sky-d` | `#1a8bbf` | Sky hover state |
| `--mid` | `#264E8B` | Secondary accent, gradients |
| `--bg` | `#0f0e1a` | Product/portal page background |
| `--surface` | `#111827` | Card surface |
| `--success` | `#4ade80` | Active / positive states |
| `--warning` | `#fbbf24` | Paused / caution states |
| `--danger` | `#ef4444` | Escalation / error states |
| `--text` | `rgba(255,255,255,0.85)` | Primary text |
| `--muted` | `rgba(255,255,255,0.40–0.55)` | Secondary text |

**Note**: `rgba(255,255,255,0.3)` (used for citations and notes) is below WCAG AA contrast — must be raised to ≥0.45 against dark backgrounds or reserved for purely decorative use.

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headlines | Playfair Display | 700, 900 | Italic variant for editorial emphasis |
| Body / UI | DM Sans | 300, 400, 500, 600 | `opsz: 9..40` optical sizing active |
| Monospace / Data | DM Mono | 400, 500 | Used for metrics, IDs, source citations |

**Line length**: Cap prose at 65–75ch.
**Loading**: Google Fonts via `@import` in `<style>` tag — suboptimal. Migrate to `next/font/google` for font-display swap and elimination of render-blocking request.

## Elevation

| Level | Usage | Value |
|---|---|---|
| Base | Page surface | `#0f0e1a` / `#1a1740` |
| Surface | Cards, panels | `rgba(255,255,255,0.03–0.05)` |
| Raised | Modals, topbar | `#0a0916` / `#111827` |
| Border | Separators | `rgba(255,255,255,0.07–0.12)` |
| Border-accent | Focus / hover | `rgba(39,170,225,0.25–0.35)` |

## Components

### Buttons
- `btn-primary`: sky background, navy-d text, `border-radius: 8px`, `padding: 13px 26px`
- `btn-ghost`: transparent, white border, sky hover
- **Missing**: `:active` scale press feedback (`transform: scale(0.97)`) on all interactive elements

### Form inputs
- Background: `rgba(255,255,255,0.05)`, border: `rgba(255,255,255,0.12)`
- Focus: sky border + faint sky background tint
- **Issue**: Labels not wired to inputs via `for`/`id` pairing

### Status badges
- Pill: `border-radius: 99px`, bg = status-color at 12% opacity, text = status-color
- Used consistently across portal

### Stat cards
- `border-radius: 12px`, `padding: 20–24px`, faint border + transparent background
- Hover: sky border tint
- **Issue**: Follows the "hero-metric template" anti-pattern on the employers page

## Motion

**No motion system currently defined.** All transitions are ad-hoc:
- Hover transitions: `0.15–0.2s` with unspecified easing (defaults to `ease`)
- No enter/exit animations on conditional renders
- No `prefers-reduced-motion` media queries anywhere
- `transition: all` used on copy button (should specify properties)
- No active/press feedback (`:active` transform) on any button

**Recommended system** (not yet implemented):
```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --t-fast: 120ms;
  --t-mid: 200ms;
  --t-slow: 300ms;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

## Layout

- Max-width: `1200px` (marketing), `1100px` (portal)
- Horizontal padding: `48px` desktop → `24px` mobile
- Grid gaps: `16–20px` for card grids, `80px` for two-column hero layouts
- Breakpoints: `900px` (single column), `600px` (narrow mobile)
