import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { marqueeWords } from "../constants";

const Row = ({ words, outline }) => (
  <div className="marquee-track flex w-max shrink-0 items-center">
    {[0, 1].map((copy) => (
      <div key={copy} aria-hidden={copy === 1 ? "true" : undefined} className="flex shrink-0 items-center">
        {words.map((w) => (
          <span key={w} className="flex items-center">
            <span className={`display px-6 text-[clamp(2.5rem,7vw,6.5rem)] md:px-10 ${outline ? "text-outline" : ""}`}>{w}</span>
            <span className="text-[clamp(1.25rem,3vw,2.5rem)] text-lime">✦</span>
          </span>
        ))}
      </div>
    ))}
  </div>
);

/** Two counter-scrolling rows that speed up and flip with scroll velocity. */
const Marquee = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const [a, b] = gsap.utils.toArray(".marquee-track");
      // Start deep into an infinite loop so reversing never hits time 0
      const ta = gsap.to(a, { xPercent: -50, ease: "none", duration: 45, repeat: -1 });
      const tb = gsap.fromTo(b, { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 50, repeat: -1 });
      ta.totalTime(ta.duration() * 100);
      tb.totalTime(tb.duration() * 100);

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
          const dir = self.direction;
          gsap.to([ta, tb], { timeScale: dir * boost, duration: 0.2, overwrite: true });
          gsap.to([ta, tb], { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-label="Technologies" className="relative overflow-hidden border-y border-line py-8 md:py-12">
      <Row words={marqueeWords} />
      <div className="mt-2 md:mt-4">
        <Row words={[...marqueeWords].reverse()} outline />
      </div>
    </section>
  );
};

export default Marquee;
