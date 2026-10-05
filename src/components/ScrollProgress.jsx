import { useRef } from "react";
import { gsap, useGSAP } from "../lib/motion";

/** Hairline at the very top that fills as the page scrolls. */
const ScrollProgress = () => {
  const bar = useRef(null);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
    </div>
  );
};

export default ScrollProgress;
