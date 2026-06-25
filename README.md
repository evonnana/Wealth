# Redbeacon Asset Management

A single-page marketing website for **Redbeacon Asset Management**, a (fictional) investment
advisory firm. Built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools,
no dependencies (other than one Google Fonts link).

🔗 **Live site:** https://evonnana.github.io/Wealth/

![Redbeacon Asset Management — hero section](preview.png)

## Features

- **Sticky navbar** with a slide-down mobile menu (collapses ≤760px)
- **Hero** section with call-to-action
- **Services / about** overview with inline SVG icons
- **Testimonials carousel** — index-based, with auto-generated navigation dots
- **Enquiry form** with client-side validation, submitted via FormSubmit AJAX (no page redirect)
- **Scroll-in reveal animations** using `IntersectionObserver`, honoring `prefers-reduced-motion`
- **Auto-updating footer year**
- Fully **responsive**, mobile-first design

## Project structure

| File         | Responsibility                                                                 |
| ------------ | ------------------------------------------------------------------------------ |
| `index.html` | Semantic markup for all sections, plus inlined SVG icons                       |
| `styles.css` | All styling — mobile-first, themable via `:root` custom properties             |
| `script.js`  | All behavior in one IIFE: nav toggle, scroll effects, carousel, form, footer   |

## Running locally

There is no build step. Open the site directly in a browser:

```powershell
Start-Process "index.html"
```

Edits to any file take effect on a browser refresh. To check responsiveness, use DevTools device
mode at the supported breakpoints: ~375px, ~768px (mobile nav collapses ≤760px), and ~1280px.

## Deployment

The site is deployed to **GitHub Pages** via **GitHub Actions** (see
`.github/workflows/deploy.yml`). Every push to the `main` branch automatically rebuilds and
publishes the site. Deployment can also be triggered manually from the repo's **Actions** tab.

## Customization

- **Theme:** all colors, typography, spacing, radius, and shadows live as custom properties in the
  `:root` block of `styles.css`.
- **Enquiry recipient:** change the `ENDPOINT` constant at the top of the form module in
  `script.js`. (FormSubmit requires a one-time email activation for new addresses.)

---

_This is a fictional demo site created for portfolio/marketing purposes._
