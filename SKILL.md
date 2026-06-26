---
name: premium-saas-landing-page
description: Build premium, Linear/Vercel/Stripe/Raycast-style SaaS landing pages featuring a Matrix-Driven Pricing & Performance-Isolated Currency Switcher and a Bento-to-Accordion Wrapper with State Persistence (the "Context Lock Constraint"). Use this whenever the user asks to build a SaaS or AI-product landing page, a Bento-Grid feature section, a pricing section with currency/billing toggles, or mentions "zero-dependency," "state isolation," "re-render guardrail," or grading via Chrome DevTools. Also trigger for any landing-page brief banning Shadcn/Radix/Headless UI/Framer Motion/Tailwind UI while explicitly allowing Tailwind CSS, Bootstrap, or three.js, and requiring hand-built CSS/WAAPI motion, semantic HTML/SEO, and a sub-500ms load budget.
---

# Premium SaaS Landing Page (Bento ↔ Accordion + Dynamic Pricing)

This skill is for **building the page itself** — markup, styles, component architecture, and motion. It does not cover hosting, repo setup, or recording a demo; that's on the person, not on the build.

This genre of brief *looks* like a design task but is graded mostly on architecture: state isolation, zero-dependency responsive logic, and semantic correctness. A beautiful page that fails the re-render check or hardcodes a price will score worse than a plainer page that passes both. Prioritize in this order while building:

| Area | Weight | What's actually being checked |
|---|---|---|
| Logic, Architecture & State Isolation | 40 pts | Pricing computed from a matrix, never hardcoded. Currency/billing toggles isolate re-renders to the price text nodes only. |
| SEO Optimization & Semantic HTML | 30 pts | `<header>/<main>/<section>/<footer>` over div soup, full meta/OG tags, accessible alt text. |
| UI/UX Usability & Motion Matching | 30 pts | Bento↔Accordion fluidity, breakpoint behavior, asset usage, hover/easing polish vs. the reference video. |

## 1. Stack & dependency rules

**Frameworks** — React, Next.js, Vue, Nuxt, SolidJS, Angular, or Vanilla JS are all fine; pick whichever you're fastest in. The patterns in this skill (co-located state, single source of truth for the active index, narrow leaf subscriptions) are framework-agnostic — only the syntax changes.

**Styling** — Tailwind CSS, Bootstrap, and custom CSS are all explicitly welcome. This is a separate axis from the component-library ban below — don't second-guess utility classes.

**3D** — three.js is explicitly permitted for visual enhancement (e.g. a 3D hero centerpiece). It is not a backdoor around the animation rule below: Feature 2's transitions and all structural motion still have to be hand-rolled CSS/WAAPI.

**Banned, repo-wide, for any core component** — Shadcn, Radix, Headless UI, Framer Motion, Tailwind UI (the paid component pack — distinct from Tailwind CSS, which is allowed). This isn't a "lose a few points" line item: using any of these voids credit for the build outright, so don't introduce them anywhere in the codebase, not just inside the Bento/Accordion code.

**Always fine, because they're the platform, not a library**: CSS Grid/Flexbox, CSS custom properties, CSS transitions/animations, `ResizeObserver`, `matchMedia`, `IntersectionObserver`, the Web Animations API, `Intl.NumberFormat`/`Intl.DateTimeFormat`.

**Never hardcode the pricing/billing values.** Computing currency and billing-cycle prices from a data matrix (§7) instead of typing literal numbers into markup is treated as a hard rule, not a best-effort target — see §7 for the exact pattern.

## 2. Asset reference — use these exactly, don't substitute or invent your own

Given files:

**SVG icons** (use only these — no external icon packs):
`arrow-path` · `arrow-trending-up` · `chart-pie` · `chevron-down` · `chevron-left` · `chevron-right` · `chevron-up` · `chevron-up-solid` · `cog-8-tooth` · `cube-16-solid` · `link` · `link-solid` · `search` · `x-mark`

**Color palette** — each color has exactly one job; don't repurpose one for a use it isn't listed for, or the system stops reading as intentional:

| Color | Hex | Use |
|---|---|---|
| Arctic Powder | `#F1F6F4` | Background |
| Mystic Mint | `#D9E8E2` | Cards / Secondary backgrounds |
| Forsythia | `#FFC801` | Primary CTA, highlights |
| Deep Saffron | `#FF9932` | Hover, gradients |
| Nocturnal Expedition | `#114C5A` | Hero background, navbar |
| Oceanic Noir | `#172B36` | Footer, dark sections |

**Fonts:**

| Family | Use |
|---|---|
| JetBrains Mono | Hero title, pricing titles, small labels, code snippets, numbers |
| Inter | Paragraphs, buttons, navigation, pricing descriptions, FAQs |

**How to wire these in:**
- Put every hex value and font name into CSS custom properties at the root once (`--color-bg`, `--color-card`, `--color-cta`, `--color-cta-hover`, `--color-hero-bg`, `--color-footer-bg`, `--font-display`, `--font-body`) and reference the variables everywhere — never re-type a hex or font name inline.
- Both fonts are on Google Fonts. Either load them via a `<link rel="preload">`/Google Fonts `<link>` with `font-display: swap`, or self-host with `@font-face` + `font-display: swap` if you want zero external font requests at runtime. Either is fine; just don't let font loading block first paint.
- Inline the SVGs as a single hidden `<svg>` sprite using `<symbol id="icon-search">…</symbol>` per icon, then reference them with `<svg><use href="#icon-search" /></svg>` wherever needed. This lets every icon inherit color via `fill: currentColor`, so the same `search` icon can sit on a light card or a dark hero and pick up the right palette color automatically, instead of you maintaining separate colored copies.
- Concrete icon → section mapping for an AI/automation product: `search` → AI Search feature card; `cog-8-tooth` → Automation card; `link` / `link-solid` → Integrations card (use `link-solid` for an active/connected state, `link` for default); `cube-16-solid` → API/Platform block; `chart-pie` → Reports/Analytics card or a stats band; `arrow-trending-up` → a growth/performance stat or dashboard metric; `chevron-down` / `chevron-up` / `chevron-up-solid` → the accordion's expand/collapse affordance; `chevron-left` / `chevron-right` → testimonial or logo-carousel navigation; `x-mark` → modal/banner dismiss; `arrow-path` → loading, sync, or "automation cycle" iconography. Every icon in the list should end up used somewhere meaningful.

## 3. Section-by-section build guide

- **Hero** — big headline in JetBrains Mono, short supporting line in Inter, one primary CTA button in Forsythia (with a Deep Saffron hover/gradient state), set against the Nocturnal Expedition background. Pair it with a lightweight illustration or animated SVG, not a stock photo. Keep the entrance animation inside the orchestration budget in §10.
- **Features (Bento ↔ Accordion)** — see §8. This is the highest-engineering-value section; don't let visual polish here come at the cost of the architecture.
- **Pricing** — three tiers (Starter / Pro / Enterprise), Monthly/Annual toggle, INR/USD/EUR currency switcher, all computed per §7. Cards sit on Mystic Mint against the Arctic Powder page background; price figures in JetBrains Mono so they read as data, not decoration.
- **Social proof** — ratings, a "trusted by N teams" line, customer quotes, and/or logos. Keep this section's text as real markup (see §10), not text baked into an image.
- **Footer** — dark, on Oceanic Noir, large confident typography, link columns, a newsletter field, and social icons. This is the one place it's fine for the type scale to get quiet again after the hero's energy.

## 4. Feature 1 — Architecture: state isolation

The natural first instinct — one `useState`/ref for currency and billing cycle living at the app root or in a context that wraps the whole page — silently re-renders far more than it should. If that state lives above where it's consumed, every component between it and the leaf re-evaluates when it changes, even when their output is identical. A DevTools profiler with "highlight updates" catches this in seconds, and points are docked the instant any global component reflows — there's no partial credit for "mostly isolated."

**Recipe that passes the guardrail:**
1. **Co-locate, don't globalize.** Currency and billing-cycle state belongs *inside* the pricing component, not at the page or app root. Nothing outside Pricing should be able to see it, let alone re-render from it.
2. **Split the context, don't share one.** If you use Context to avoid prop-drilling within Pricing, create a small `PriceContext` consumed *only* by leaf `<PriceText>` nodes — never by card chrome (title, feature list, border, badge). Chrome should read zero props/context that change on toggle, so the reconciler bails out of it entirely.
3. **Memoize the chrome** (`React.memo`, Vue's `v-once`/`shallowRef`, etc.) so a parent re-render for unrelated reasons still can't touch it.
4. **For the strictest guarantee, go imperative for the number itself.** Drive `<PriceText>` off a ref and a plain `textContent` write rather than a prop threaded through JSX/templates. The framework's diffing never visits anything above that node — there's nothing to diff, so there's nothing to accidentally get wrong. In Vanilla JS this is the default behavior anyway, since there's no virtual DOM to escape.
5. **Verify it yourself before calling it done.** DevTools → Rendering → "Paint flashing," or your framework's profiler with "highlight updates" — toggle currency and billing, confirm *only* the price text flashes. Don't assume the architecture is correct; watch it.

## 5. Feature 1 — Pricing: a real matrix, not a multiplied constant

The brief asks for a **multi-dimensional configuration object** factoring a base tier rate, a flat 20% annual-discount multiplier, and *regional tariff variables* (plural) — that phrasing signals per-currency prices as their own data, not one global FX rate times a base. Giving each currency its own listed price per tier is unambiguously a matrix, removes any debate about whether you "really" avoided hardcoding, and matches how real SaaS regional pricing actually works (prices are set deliberately per region, not pure FX conversion).

```js
// dimensions: tier × currency × billingCycle
const PRICING_MATRIX = {
  starter:    { INR: 999,  USD: 19, EUR: 18 },
  pro:        { INR: 2499, USD: 49, EUR: 45 },
  enterprise: { INR: null, USD: null, EUR: null }, // null → render "Contact us"
};

const ANNUAL_DISCOUNT = 0.20; // flat multiplier, applied uniformly across the matrix
const CURRENCY_META = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'en-IE' },
};

function getPrice(tier, currency, billingCycle) {
  const base = PRICING_MATRIX[tier][currency];
  if (base == null) return null; // caller renders "Contact us"
  const amount = billingCycle === 'annual' ? base * (1 - ANNUAL_DISCOUNT) : base;
  const { symbol, locale } = CURRENCY_META[currency];
  // Intl.NumberFormat is a native browser API, not a UI library.
  return symbol + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
}
```

`getPrice` is the *only* place a currency symbol or numeric literal exists. Every `<PriceText>` leaf calls it and renders the result — never type `₹999`, `$15`, or `€12` anywhere in markup.

## 6. Feature 2 — Bento Grid → Accordion: satisfy the Context Lock Constraint by construction

The Context Lock Constraint: if a user is hovering/interacting with a bento node on desktop and resizes past the mobile breakpoint mid-interaction, that exact active index must transfer to the mobile Accordion, opening the right panel smoothly. The robust way to satisfy this isn't to write resize-listener code that *copies* a hover index into an accordion index — it's to never have two indices in the first place.

**Primary pattern — one DOM, two layouts, one piece of state:**

```jsx
const [activeIndex, setActiveIndex] = useState(0);

// Each panel, rendered once, reused at every breakpoint — never unmounted/remounted:
<div className="feature-panel" data-active={activeIndex === i}>
  <button
    className="feature-panel-header"
    aria-expanded={activeIndex === i}
    aria-controls={`panel-${i}`}
    onMouseEnter={() => setActiveIndex(i)}                      // desktop: hover sets it
    onClick={() => setActiveIndex(i === activeIndex ? -1 : i)}  // mobile: tap toggles it
  >
    {title} <ChevronIcon />
  </button>
  <div id={`panel-${i}`} role="region" className="feature-panel-body">...</div>
</div>
```

Using a real `<button>` for the header gets keyboard activation (Enter/Space) and focus handling for free — don't swap it for a `<div onClick>`. `aria-expanded`/`aria-controls`/`role="region"` cost nothing and are what a screen reader needs to understand the accordion state.

```css
.feature-panel-body {
  /* Declare the transition unconditionally, not nested inside the media query —
     if it only exists once you're already in the mobile breakpoint, the first
     style recalculation after crossing it can snap instead of animate. */
  max-height: 0;
  overflow: hidden;
  transition: max-height 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto); /* bento layout via grid-area per panel */
}
@media (max-width: 768px) {
  .features-grid { display: flex; flex-direction: column; }
  .feature-panel[data-active="true"] .feature-panel-body { max-height: 480px; }
  .feature-panel-header .chevron { transition: transform 200ms ease-out; }
  .feature-panel[data-active="true"] .chevron { transform: rotate(180deg); }
}
```

Because desktop hover and mobile tap both just set the same `activeIndex`, hovering card 3 and resizing straight to mobile lands on card 3 already open — there's no separate "transfer the context" step to write or get wrong, because there was never a second piece of state to transfer it from. If you need different *behavior* per breakpoint (e.g. disabling the hover handler on touch devices), branch on a `matchMedia('(max-width: 768px)')` listener — but only branch behavior, never reset or duplicate `activeIndex` there.

**Fallback pattern**, for cases where desktop and mobile genuinely render different component trees: keep `activeIndex` lifted one level above both, in the parent that mounts whichever variant is active, and pass it down as a prop to both — never store it *inside* either the Bento or Accordion component itself, or it gets destroyed on unmount. The principle is identical either way: exactly one source of truth for "which card is active," with both layouts reading from it rather than writing independent copies.

**On "smoothly":** the expected smoothness is the accordion panel's height transition once you've landed in mobile layout — not a continuous shared-layout morph of grid cells reflowing into list rows. That kind of cross-layout shared-element animation is what FLIP/animation engines exist for, and those are the exact category banned for Feature 2. Don't over-engineer a problem the brief isn't asking you to solve.

## 7. Motion: CSS/WAAPI only, exact timings and easing per category

Different easing per category — don't default to one curve everywhere:

- **Micro-interactions (hovers/toggles): 150–200ms, ease-out.** Card lift, button hover, icon color shift, chevron rotation.
- **Structural layout reflows: 300–400ms, ease-in-out.** Accordion expand/collapse, section reveals, any layout-affecting state change.
- For entrance choreography (hero fade-in, staggered bento reveal), prefer the Web Animations API (`element.animate(...)`) over chaining `animation-delay` values — easier to guarantee the whole sequence lands inside the orchestration budget in §10 and to cancel/replay cleanly.
- Scroll-triggered reveals: `IntersectionObserver` toggling a `data-visible` attribute that a CSS transition responds to. No scroll libraries.
- Respect `prefers-reduced-motion: reduce` — collapse entrance animation to near-instant for users who request it.
- Pick **one** signature motion moment — the bento↔accordion morph is a strong candidate, since it's also the hardest engineering piece — and keep everything else quiet around it.

## 8. Semantic HTML & SEO

- `<header>` for the navbar, `<main>` wrapping primary content, one `<section>` per major block, `<footer>` for the footer. A `<div>` is correct only for pure layout wrappers with no semantic meaning of their own — not for anything that *is* a header, nav, or section.
- `<nav>` inside `<header>`; one `<h1>` (hero headline); `<h2>` per section title; don't skip heading levels.
- Required metadata: `<title>`, `<meta name="description">`, full Open Graph set (`og:title`, `og:description`, `og:image`, `og:type`), viewport meta tag.
- Every meaningful image/icon needs real `alt` text (or `aria-hidden="true"` if purely decorative and adjacent text already conveys the meaning).
- Keep all copy as real text nodes, never baked into images or icon fonts, so it stays crawlable.

## 9. Performance & the loading sequence

- Inline critical above-the-fold CSS; defer the rest.
- `font-display: swap` (or preload) the two brand fonts so type doesn't block first paint.
- The entire entry/loader orchestration must resolve within 500ms **and** must not delay Time to Interactive — interactivity can't be gated behind the loader finishing.
- Keep real `<main>` content present in the DOM immediately rather than conditionally rendering it only after the loader finishes — the loader should be a visual overlay on top of already-present markup, not a gate in front of it, so the page stays crawlable from the first paint.
- Lazy-load below-the-fold imagery (`loading="lazy"`, or `IntersectionObserver`-driven mounting for heavier sections like a dashboard mockup).
- Reserve space (aspect-ratio boxes) for images/illustrations so late-loading assets don't cause layout thrash.

## 10. Distinctive visual design, not just a checklist

The asset package fixes palette and type pairing, and layout/copy/visual storytelling are explicitly left to your discretion — so spend your design judgment on what's actually open: layout rhythm, spacing scale, copy voice, and one signature moment (see §7). A hero is a thesis — open with the single most characteristic claim or visual for *this* product, not a generic "headline + CTA + gradient blob" template unless that's genuinely the strongest choice. Write copy from the user's side of the screen, active voice, specific over clever.

## 11. Build-quality checklist

- [ ] No price string is ever hand-typed in markup — every number flows through one calculation function reading the matrix.
- [ ] Toggling currency or billing cycle, verified in DevTools, updates only the price text nodes — nothing else flashes/re-renders.
- [ ] Bento Grid and Accordion are the *same* underlying component/DOM, restyled by a media query — not two components that swap and lose state.
- [ ] Hovering a card on desktop then resizing to mobile mid-hover shows that exact card already open, with no special "transfer" code beyond not destroying state.
- [ ] Accordion triggers are real `<button>` elements with `aria-expanded`/`aria-controls` set correctly.
- [ ] No banned library appears anywhere in the dependency tree, not just in the Feature 2 code path.
- [ ] `<header>/<main>/<section>/<footer>` used correctly; one `<h1>`; no skipped heading levels; no semantic-meaning divs.
- [ ] `<title>`, meta description, full Open Graph set, and real `alt` text on every content image.
- [ ] Loader/entry sequence finishes inside 500ms, doesn't block interactivity, and doesn't gate semantic content out of the initial DOM.
- [ ] Micro-interactions sit in 150–200ms with ease-out; structural layout reflows sit in 300–400ms with ease-in-out.
- [ ] Every shipped SVG icon and every palette color/font role is actually used somewhere meaningful.
- [ ] Layout holds with no horizontal clipping or overlapping type at mobile, tablet, and desktop widths.

## Suggested component shape (React-flavored; same shape applies in Vue/Solid/Angular/Vanilla)

```
LandingPage
├── Header (nav)
├── main
│   ├── Hero
│   ├── FeaturesSection           (owns activeIndex; renders FeaturePanel × N)
│   │   └── FeaturePanel          (memoized chrome; identical DOM at every breakpoint)
│   ├── PricingSection            (owns currency + billingCycle, scoped here only)
│   │   └── PricingCard           (memoized chrome)
│   │       └── PriceText         (the only thing that reads currency/billing/getPrice)
│   └── SocialProof
└── Footer
```

Everything above `FeaturesSection`/`PricingSection` should be structurally incapable of re-rendering when their internal toggles change — not just "happens to not re-render today."