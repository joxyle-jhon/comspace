# Design System Master File — Comspace (Direction 1: Warm Editorial & Nomad Luxury)

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Comspace — Airbnb-style Property Booking & Reservation Platform
**Design System:** Direction 1 — Warm Editorial & Nomad Luxury
**Brand Primary:** Warm Gradient Terracotta Orange (`#FF5A1F` / `#FF6B00`) from User Logo
**Target Bar:** Product-grade modern UX (in the vein of Lovable's clean, confident design)

---

## Global Color Tokens

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Brand Primary** | `#FF5A1F` | `--brand-primary` | Main logo color, primary CTA buttons, active state highlights |
| **Brand Secondary** | `#FF7A45` | `--brand-secondary` | Gradient endpoints, hover highlights |
| **Brand Light** | `#FFF0EB` | `--brand-light` | Soft pill backgrounds, active badge tints |
| **Foreground / Headings** | `#0F172A` | `--color-foreground` | Primary text, deep slate headers |
| **Muted Body Text** | `#475569` | `--color-muted` | Body text, subtle subtitles, labels |
| **Subtle Sub-text** | `#94A3B8` | `--color-subtle` | Helper text, placeholder text |
| **Background Linen** | `#FDFBF9` | `--color-background` | Main page background (warm editorial linen) |
| **Card Cream White** | `#FFFFFF` | `--color-card` | Elevating content cards, modals, sticky containers |
| **Border Soft** | `#E2E8F0` | `--color-border` | Subtle hairline card borders |
| **Border Hover** | `#CBD5E1` | `--color-border-hover` | Interactive element hover ring |
| **Destructive** | `#EF4444` | `--color-destructive` | Error messages, cancel badges |
| **Success Emerald** | `#059669` | `--color-success` | Verified badges, confirmation checkmarks |

---

## Typography System

- **Display & Headings:** `Outfit` (Google Fonts: 600, 700, 800, 900)
- **Body & Interface:** `Inter` (Google Fonts: 400, 500, 600, 700)
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&display=swap');
```

---

## Spacing & Radius System

- **Border Radii:**
  - Cards: `24px` (`rounded-3xl`)
  - Floating Panels / Drawers: `32px` (`rounded-[32px]`)
  - Buttons / Pills: `9999px` (`rounded-full`)
  - Inputs / Dropdowns: `16px` (`rounded-2xl`)

- **Shadow Depths:**
  - `shadow-sm`: `0 1px 2px rgba(15, 23, 42, 0.04)`
  - `shadow-md`: `0 4px 12px rgba(15, 23, 42, 0.06)`
  - `shadow-xl`: `0 20px 40px -12px rgba(255, 90, 31, 0.12)` (Warm brand glow)

---

## Microcopy & Humanization Rules

- Never use raw SaaS clichés ("Discover amazing places", "Find your space").
- Use conversational, place-first phrasing ("Find your next stay", "Spaces crafted for deep work & long stays", "Hosted by Sarah in Kyoto").
- Empty states must be encouraging ("No stays in this specific category yet — try adjusting dates or clearing filters").
- Loading states must use structured pulse skeletons matching exact card layout.

---

## Pre-Delivery Checklist
- [ ] No emojis as icons (use Lucide SVG icons exclusively)
- [ ] `cursor-pointer` on all interactive buttons, tabs, and cards
- [ ] Hover states with smooth transitions (150ms-250ms `cubic-bezier(0.4, 0, 0.2, 1)`)
- [ ] Light mode contrast minimum 4.5:1 for WCAG AA compliance
- [ ] Responsive across breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (large screen)
