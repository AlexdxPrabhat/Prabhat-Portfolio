# Prabhat Bisht — Portfolio

ServiceNow developer by day, product builder by night. A motion-driven portfolio built with React, GSAP and WebGL.

**Live:** https://prabhat-portfolio-umber.vercel.app/

## Highlights

- **Live WebGL hero**: a domain-warped light field that follows the cursor and reacts to the voice intro's loudness in real time
- **AI voice intro** with synced captions, generated offline with [Kokoro](https://github.com/hexgrad/kokoro) (Apache-2.0)
- **Motion system** on GSAP (ScrollTrigger + SplitText) and Lenis smooth scrolling:
  loader curtain, masked letter reveals, scroll-scrubbed text, count-up stats, velocity-reactive marquee,
  pinned horizontal project gallery with parallax, cursor-following previews, magnetic buttons and a custom cursor
- **Fully responsive**: heavy effects scale down on phones; `prefers-reduced-motion` gets a calm, static version
- **Accessible**: keyboard-friendly menus and dialogs, focus trapping, live captions, skip link

## Stack

React 18 · Vite · Tailwind CSS · GSAP · Lenis · raw WebGL · EmailJS · Vercel

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

All content (experience, certifications, projects, skills, education, stats) lives in `src/constants.js`.

## Regenerating the voice intro

The narration script, voice and pronunciations are in `scripts/generate-intro-audio.py`.

```bash
pip install kokoro-onnx soundfile
# download kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
python scripts/generate-intro-audio.py --models path/to/model-dir
```

This writes `src/assets/audio/intro.mp3` and the caption timings in `intro-captions.json` (needs ffmpeg on PATH).
Change `VOICE` in the script (for example `am_michael` or `bm_george`) for a different narrator.
