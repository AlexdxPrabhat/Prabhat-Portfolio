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
const art = projects.slice(0, panels.length);

/**
 * Rockstar-style opening: a solid sky with "PB" cut out of it, so the live
 * hero shows through the letters. Scrolling throws the project collage
 * outward and zooms through the P until the hero fills the screen.
 */
const Prologue = ({ ready }) => {
  const root = useRef(null);
  const svg = useRef(null);
  const word = useRef(null);
  // Portrait screens only show the middle of the square scene, so shrink the letters there
  const query = "(max-aspect-ratio: 1/1)";
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const type = narrow ? { fontSize: 210, y: 575, letterSpacing: -8 } : { fontSize: 330, y: 610, letterSpacing: -12 };

  // Scroll-driven reveal (set up once)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const section = root.current.closest("section");

      // Zoom from inside the stem of the P so the letter opens onto the hero
      const setOrigin = () => {
        const b = word.current.getBBox();
        const pt = svg.current.createSVGPoint();
        pt.x = b.x + b.width * 0.105;
        pt.y = b.y + b.height * 0.62;
        const screen = pt.matrixTransform(word.current.getScreenCTM());
        const r = svg.current.getBoundingClientRect();
        gsap.set(svg.current, { transformOrigin: `${screen.x - r.left}px ${screen.y - r.top}px` });
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
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
        const cfg = panels[i];
        tl.to(p, { xPercent: cfg.dx * 160, yPercent: cfg.dy * 160, scale: 1.35, rotation: cfg.rot * 2, autoAlpha: 0, ease: "power2.in", duration: 0.45 }, 0);
      });
      tl.to(".pr-caption", { autoAlpha: 0, y: 40, duration: 0.2 }, 0)
        .to(".pr-fill", { autoAlpha: 0, duration: 0.22 }, 0.08)
        .to(svg.current, { scale: 70, ease: "power3.in", duration: 0.85 }, 0.15)
        .to(root.current, { autoAlpha: 0, duration: 0.1 }, 0.9);

      const onRefreshInit = () => {
        const p = tl.progress();
        tl.progress(0);
        setOrigin();
        tl.progress(p);
      };
      setOrigin();
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
      return () => ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    },
    { scope: root }
  );

  // Entrance after the loader: panels drop in, the outline glows up, caption rises
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".pr-panel-inner", { yPercent: 40, autoAlpha: 0, scale: 0.8, duration: 1.4, stagger: { each: 0.07, from: "random" } }, 0.1)
        .from(".pr-fill", { autoAlpha: 0, y: 40, duration: 1.6, ease: "expo.out" }, 0.2)
        .from(svg.current, { scale: 0.92, duration: 2, ease: "expo.out" }, 0)
        .from(".pr-caption > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.6);
    },
    { dependencies: [ready], scope: root }
  );

  if (prefersReducedMotion()) return null;

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Sky with the monogram cut out of it */}
      <svg ref={svg} className="absolute inset-0 h-full w-full will-change-transform" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b0a18" />
            <stop offset="0.55" stopColor="#170f2e" />
            <stop offset="1" stopColor="#2a1336" />
          </linearGradient>
          <linearGradient id="pr-sunset" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#ff6fa8" />
            <stop offset="0.45" stopColor="#ffb067" />
            <stop offset="0.75" stopColor="#ff8fb8" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="pr-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.45 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="pr-mask" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="9000" height="9000">
            <rect x="-4000" y="-4000" width="9000" height="9000" fill="white" />
            <text x="500" y={type.y} textAnchor="middle" fontFamily="'Inter Tight Variable', sans-serif" fontWeight="900" fontSize={type.fontSize} letterSpacing={type.letterSpacing} fill="black">
              PB
            </text>
          </mask>
        </defs>
        <rect x="-4000" y="-4000" width="9000" height="9000" fill="url(#pr-sky)" mask="url(#pr-mask)" />
        <text
          ref={word}
          className="pr-fill"
          x="500"
          y={type.y}
          textAnchor="middle"
          fontFamily="'Inter Tight Variable', sans-serif"
          fontWeight="900"
          fontSize={type.fontSize}
          letterSpacing={type.letterSpacing}
          fill="url(#pr-sunset)"
          filter="url(#pr-glow)"
        >
          PB
        </text>
      </svg>

      {/* Sunset haze along the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(255,143,184,0.22),transparent_70%)]" />

      {/* Project collage */}
      {art.map((p, i) => {
        const c = panels[i];
        return (
          <div
            key={p.id}
            className={`pr-panel absolute ${i % 2 ? "hidden sm:block" : ""}`}
            style={{ left: `${c.left}%`, top: `${c.top}%`, width: `max(${c.w}vw, 130px)`, rotate: `${c.rot}deg` }}
          >
            <div className="pr-panel-inner overflow-hidden rounded-xl border border-paper/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
              <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover" style={{ objectPosition: p.imagePosition }} />
            </div>
          </div>
        );
      })}

      {/* Caption under the monogram */}
      <div className="pr-caption absolute inset-x-0 bottom-[7%] flex flex-col items-center gap-3 px-6 text-center">
        <p className="font-condensed text-2xl tracking-[0.12em] text-paper md:text-3xl">Prabhat Bisht</p>
        <p className="text-[11px] uppercase tracking-[0.3em] text-sunset-pink md:text-xs">ServiceNow Developer · Product Builder</p>
        <span className="mt-2 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-paper/50">
          Scroll to enter
          <FiChevronDown className="animate-bounce text-base motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  );
};

export default Prologue;
