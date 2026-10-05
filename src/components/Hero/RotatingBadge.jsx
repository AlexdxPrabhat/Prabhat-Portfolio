import { useRef } from "react";
import { FiArrowDown } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, scrollToSection, prefersReducedMotion } from "../../lib/motion";

/** Circular text ring that spins, faster while the page scrolls. */
const RotatingBadge = ({ className = "" }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const spin = gsap.to(".badge-ring", { rotation: 360, duration: 24, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 8);
          gsap.to(spin, { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to(spin, { timeScale: 1, duration: 1.4, delay: 0.2, ease: "power2.out" });
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative grid h-36 w-36 place-items-center lg:h-48 lg:w-48 ${className}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true" className="badge-ring absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-paper/80 text-[12.5px] font-medium uppercase">
          <textPath href="#badge-circle" textLength="500" lengthAdjust="spacing">
            ServiceNow CSA ✦ Product builder ✦ Based in Bengaluru ✦
          </textPath>
        </text>
      </svg>
      <button
        type="button"
        onClick={() => scrollToSection("#about")}
        aria-label="Scroll to About"
        data-cursor="Dive in"
        className="grid h-14 w-14 place-items-center rounded-full bg-lime text-xl text-ink transition-transform duration-500 ease-expo hover:scale-110 lg:h-20 lg:w-20"
      >
        <FiArrowDown aria-hidden="true" />
      </button>
    </div>
  );
};

export default RotatingBadge;
