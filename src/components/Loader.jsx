import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/motion";

/**
 * Counts to 100 while fonts load, then lifts like a curtain.
 * `onReveal` fires as the curtain starts to lift (hero animates underneath),
 * `onDone` once it is fully gone.
 */
const Loader = ({ onReveal, onDone }) => {
  const root = useRef(null);
  const count = useRef(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const counter = { v: 0 };
      const tl = gsap.timeline({ paused: true, onComplete: onDone });
      tl.from(".ld-in", { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.06 })
        .to(
          counter,
          {
            v: 100,
            duration: reduced ? 0.3 : 1.6,
            ease: "power3.inOut",
            onUpdate: () => {
              count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.1
        )
        .to(".ld-bar", { scaleX: 1, duration: reduced ? 0.3 : 1.6, ease: "power3.inOut" }, 0.1)
        .to(".ld-in", { yPercent: -110, duration: 0.7, ease: "expo.in", stagger: 0.04 })
        .add(() => onReveal?.(), "-=0.15")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: reduced ? 0.3 : 1.1, ease: "expo.inOut" }, "-=0.2");

      // Never wait on fonts for more than a moment
      const fonts = document.fonts?.ready ?? Promise.resolve();
      Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]).then(() => tl.play());
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-[var(--gutter)] text-paper"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex justify-between text-xs uppercase tracking-[0.22em] text-muted">
        <span className="overflow-hidden"><span className="ld-in block">Prabhat Bisht</span></span>
        <span className="overflow-hidden"><span className="ld-in block">Portfolio ©{new Date().getFullYear()}</span></span>
      </div>
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between md:gap-6">
        <span className="overflow-hidden">
          <span className="ld-in block max-w-xs font-serif text-2xl italic text-paper/80 md:text-3xl">
            Systems that work. Products people enjoy.
          </span>
        </span>
        <span className="self-end overflow-hidden">
          <span ref={count} className="ld-in display block text-[clamp(5rem,20vw,16rem)] tabular-nums">
            000
          </span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-line">
        <div className="ld-bar h-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  );
};

export default Loader;
