import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "../../lib/motion";
import { projects } from "../../constants";

// Collage panels around the monogram: position (% of the screen), width, tilt,
// and the direction each one flies off in as you scroll.
const panels = [
  { left: 3, top: 9, w: 19, rot: -6, dx: -1.2, dy: -0.8 },
  { left: 24, top: 4, w: 15, rot: 4, dx: -0.6, dy: -1.3 },
  { left: 63, top: 3, w: 15, rot: -4, dx: 0.6, dy: -1.3 },
  { left: 80, top: 10, w: 18, rot: 6, dx: 1.2, dy: -0.8 },
  { left: 2, top: 57, w: 18, rot: 5, dx: -1.3, dy: 0.7 },
  { left: 21, top: 73, w: 15, rot: -5, dx: -0.6, dy: 1.3 },
  { left: 65, top: 72, w: 15, rot: 3, dx: 0.6, dy: 1.3 },
  { left: 81, top: 56, w: 17, rot: -6, dx: 1.3, dy: 0.7 },
];
// Phones: four larger panels in the corners, clear of the letters and caption
const phonePanels = [
  { left: 4, top: 10, w: 40, rot: -5, dx: -1.2, dy: -1 },
  { left: 56, top: 15, w: 40, rot: 4, dx: 1.2, dy: -1 },
  { left: 4, top: 61, w: 40, rot: 4, dx: -1.2, dy: 1 },
  { left: 56, top: 65, w: 40, rot: -4, dx: 1.2, dy: 1 },
];
const art = projects.slice(0, panels.length);
const PHONE_QUERY = "(max-aspect-ratio: 4/5)";
const FONT = '"Inter Tight Variable", "Inter Tight", system-ui, sans-serif';

/**
 * Rockstar-style opening: a sky with "PB" cut out of it, so the live hero
 * shows through the letters. Scrolling throws the project collage outward and
 * zooms through the P until the hero fills the screen.
 *
 * Drawn on a canvas at screen size every frame (rather than scaling a vector
 * layer 60x), so the cost stays flat however deep the zoom goes, including
 * when scrolling back up.
 */
const Prologue = ({ ready }) => {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const state = useRef({ scale: 1, fill: 1, enter: 0 });
  const drawRef = useRef(() => {});
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const layout = phone ? phonePanels : panels;

  // Canvas + scroll-driven reveal (set up once)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const section = root.current.closest("section");
      let g = null;

      const layout = () => {
        const r = canvas.getBoundingClientRect();
        const w = r.width;
        const h = r.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const narrow = h > w;
        const fs = narrow ? w * 0.46 : Math.min(h * 0.5, w * 0.31);
        ctx.font = `900 ${fs}px ${FONT}`;
        const mp = ctx.measureText("P");
        const mb = ctx.measureText("B");
        const gap = -fs * 0.03;
        const total = mp.width + gap + mb.width;
        const xP = (w - total) / 2;
        const xB = xP + mp.width + gap;
        const base = h * 0.49 + fs * 0.36;
        // Zoom origin: middle of the P's stem
        const ox = xP - mp.actualBoundingBoxLeft + fs * 0.1;
        const oy = base - fs * 0.36;
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, "#0c0c0c");
        sky.addColorStop(1, "#151515");
        const haze = ctx.createRadialGradient(w / 2, h * 1.05, 0, w / 2, h * 1.05, h * 0.75);
        haze.addColorStop(0, "rgba(238,238,234,0.06)");
        haze.addColorStop(1, "rgba(238,238,234,0)");
        const letters = "#eeeeea";
        g = { w, h, dpr, fs, xP, xB, base, ox, oy, sky, haze, letters };
      };

      const draw = () => {
        if (!g) return;
        const { scale, fill, enter } = state.current;
        ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = g.sky;
        ctx.fillRect(0, 0, g.w, g.h);
        ctx.fillStyle = g.haze;
        ctx.fillRect(0, 0, g.w, g.h);

        ctx.save();
        ctx.translate(g.ox, g.oy);
        ctx.scale(scale, scale);
        ctx.translate(-g.ox, -g.oy + (1 - enter) * 30);
        ctx.font = `900 ${g.fs}px ${FONT}`;
        // Cut the letters out of the sky
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.fillText("P", g.xP, g.base);
        ctx.fillText("B", g.xB, g.base);
        // Sunset fill on top while the logo is "closed"
        const a = fill * enter;
        if (a > 0.005) {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = a;
          ctx.fillStyle = g.letters;
          ctx.fillText("P", g.xP, g.base);
          ctx.fillText("B", g.xB, g.base);
        }
        ctx.restore();
      };
      drawRef.current = draw;

      layout();
      draw();
      document.fonts?.ready.then(() => {
        layout();
        draw();
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: draw,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray(".pr-panel").forEach((p, i) => {
        const cfg = (window.matchMedia(PHONE_QUERY).matches ? phonePanels : panels)[i];
        tl.to(p, { xPercent: cfg.dx * 160, yPercent: cfg.dy * 160, scale: 1.35, rotation: cfg.rot * 2, autoAlpha: 0, ease: "power2.in", duration: 0.45 }, 0);
      });
      tl.to(".pr-caption", { autoAlpha: 0, y: 40, duration: 0.2 }, 0)
        .to(state.current, { fill: 0, duration: 0.22 }, 0.08)
        .to(state.current, { scale: 60, ease: "power3.in", duration: 0.85 }, 0.15)
        .to(root.current, { autoAlpha: 0, duration: 0.1 }, 0.9);

      const onRefresh = () => {
        layout();
        draw();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);
      return () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        drawRef.current = () => {};
      };
    },
    { scope: root, dependencies: [phone], revertOnUpdate: true }
  );

  // Entrance after the loader: panels drop in, letters rise and glow, caption follows
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".pr-panel-inner", { yPercent: 40, autoAlpha: 0, scale: 0.8, duration: 1.4, stagger: { each: 0.07, from: "random" }, clearProps: "transform" }, 0.1)
        .to(state.current, { enter: 1, duration: 1.8, onUpdate: () => drawRef.current() }, 0.2)
        .from(".pr-caption > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.6);
    },
    { dependencies: [ready], scope: root }
  );

  if (prefersReducedMotion()) return null;

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[100svh] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Project collage */}
      {art.slice(0, layout.length).map((p, i) => {
        const c = layout[i];
        return (
          <div
            key={p.id}
            className="pr-panel absolute"
            style={{ left: `${c.left}%`, top: `${c.top}%`, width: `${c.w}vw`, rotate: `${c.rot}deg` }}
          >
            <div className="pr-panel-inner overflow-hidden rounded-xl border border-paper/15 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.9)]">
              <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover" style={{ objectPosition: p.imagePosition }} />
            </div>
          </div>
        );
      })}

      {/* Caption under the monogram */}
      <div className="pr-caption absolute inset-x-0 bottom-[7%] flex flex-col items-center gap-3 px-6 text-center">
        <p className="text-base font-semibold uppercase tracking-[0.24em] text-paper md:text-xl md:tracking-[0.32em]">Prabhat Bisht</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent md:text-xs md:tracking-[0.3em]">ServiceNow Developer · Product Builder</p>
        <span className="mt-2 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-paper/50">
          Scroll to enter
          <FiChevronDown className="animate-bounce text-base motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  );
};

export default Prologue;
