# Prabhat Bisht — Portfolio

ServiceNow developer by day, product builder by night. A motion-driven portfolio built with React and GSAP.

**Live:** https://prabhat-portfolio-umber.vercel.app/

## Highlights

- **Motion-graphics hero** built around my real headshot: a clean cut-out in front of a glowing halo, drawn-in orbit rings,
  orbiting tech logos and floating credential cards, all with pointer-driven depth parallax
- **Motion system** on GSAP (ScrollTrigger + SplitText) and Lenis smooth scrolling:
  loader curtain, masked letter reveals, scroll-scrubbed text, count-up stats, velocity-reactive marquee,
  pinned horizontal project gallery with parallax, cursor-following previews, magnetic buttons and a custom cursor
- **Fully responsive**: heavy effects scale down on phones; `prefers-reduced-motion` gets a calm, static version
- **Accessible**: keyboard-friendly menus and dialogs, focus trapping, skip link

## Stack

React 18 · Vite · Tailwind CSS · GSAP · Lenis · EmailJS · Vercel

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

All content (experience, certifications, projects, skills, education, stats) lives in `src/constants.js`.
