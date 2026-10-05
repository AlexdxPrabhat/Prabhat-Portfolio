# Prabhat Bisht — Portfolio

ServiceNow developer by day, product builder by night. A motion-driven portfolio built with React, GSAP and WebGL.

**Live:** https://prabhat-portfolio-umber.vercel.app/

## Highlights

- **Talking AI avatar** in the hero, made from my real headshot (face untouched, studio backdrop swapped in),
  animated with [SadTalker](https://github.com/OpenTalker/SadTalker) and voiced with [Kokoro](https://github.com/hexgrad/kokoro), with synced captions
- **Motion system** on GSAP (ScrollTrigger + SplitText) and Lenis smooth scrolling:
  loader curtain, masked letter reveals, scroll-scrubbed text, count-up stats, velocity-reactive marquee,
  pinned horizontal project gallery with parallax, cursor-following previews, magnetic buttons and a custom cursor
- **Fully responsive**: heavy effects scale down on phones; `prefers-reduced-motion` gets a calm, static version
- **Accessible**: keyboard-friendly menus and dialogs, focus trapping, live captions, skip link

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

## Regenerating the avatar intro

1. **Voice and captions**: edit the script lines or `VOICE` in `scripts/generate-intro-audio.py`, then

   ```bash
   pip install kokoro-onnx soundfile
   # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
   python scripts/generate-intro-audio.py --models path/to/model-dir
   ```

   This writes `scripts/build/intro.wav` and `src/assets/avatar/intro-captions.json`.

2. **Talking video**: with a local [SadTalker](https://github.com/OpenTalker/SadTalker) install (GPU recommended),

   ```bash
   python scripts/generate-avatar-video.py --sadtalker path/to/SadTalker        --python path/to/sadtalker/venv/Scripts/python.exe --portrait path/to/portrait.png
   ```

   This writes `portrait.webp` (the untouched photo shown while idle) and `intro.mp4` to `src/assets/avatar/`. Both steps need ffmpeg on PATH.
