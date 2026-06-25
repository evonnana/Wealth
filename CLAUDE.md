# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page marketing website for **Redbeacon Asset Management**, a (fictional) investment
advisory firm. Built with **vanilla HTML, CSS, and JavaScript only** — no frameworks, no build
tools, no package manager, no dependencies except one Google Fonts `<link>`. There is no compile,
lint, or test step.

## Running / "building"

There is no build. Open the site directly in a browser:

```powershell
Start-Process "index.html"
```

Edits to any of the three files take effect on a browser refresh. To check responsiveness, use
DevTools device mode at the supported breakpoints: ~375px, ~768px (mobile nav collapses ≤760px),
and ~1280px.

## File layout & responsibilities

- `index.html` — semantic structure for all sections in order: sticky navbar, hero, services/about,
  testimonials carousel, enquiry form, footer. SVG icons are inlined here.
- `styles.css` — all styling. **Mobile-first**; everything themable lives in `:root` custom
  properties (palette, typography, spacing scale, radius, shadows, `--header-h`, `--container`).
  Three breakpoint blocks: ≥600px, ≥900px, and a ≤760px block that turns the nav into a slide-down panel.
- `script.js` — all behavior, wrapped in one IIFE. Six self-contained modules: mobile nav toggle,
  header-shadow-on-scroll, IntersectionObserver reveal animations, testimonial carousel, enquiry
  form (validation + submit), and the auto-updating footer year.

The three files are coupled only by shared `id`/`class` names — there is no module system. When
adding behavior, find or add an `id` in `index.html`, style by class in `styles.css`, and wire it in
the relevant module in `script.js`.

## Architecture notes that span files

- **Scroll-in animations:** elements opt in with `class="reveal"` in HTML. `script.js` observes them
  and adds `.is-visible`. Both `styles.css` and `script.js` independently honor
  `prefers-reduced-motion` — keep both paths in sync if you change animation behavior.
- **Sticky-header anchor offset:** smooth scrolling is CSS (`scroll-behavior` + `scroll-padding-top`
  tied to `--header-h`). If you change header height, update `--header-h` so anchor targets aren't
  hidden under the navbar.
- **Carousel** is index-based: a flex track translated by `-index * 100%`. Dots are generated in JS
  from the slide count, so adding/removing `.slide` elements in HTML requires no JS change.

## Enquiry form (the one piece with external behavior)

- Submits via **FormSubmit AJAX** (`fetch` POST JSON) so the page never redirects. The destination
  address is the `ENDPOINT` constant at the top of the form module in `script.js` — currently
  `isaiah.hui@redbeaconam.com`. This is the single place to change the recipient.
- FormSubmit requires a **one-time activation**: the first submission to a new address triggers a
  confirmation email; the form only delivers after that link is clicked.
- The payload includes FormSubmit helper fields (`_subject`, `_template: "table"`, `_captcha: "false"`)
  plus a hidden `_honey` honeypot for spam. Client-side validation (required fields + email regex)
  runs before any network call.
