import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, isFinePointer, prefersReducedMotion } from "../../lib/motion";
import NetworkField from "./NetworkField";
import { SILHOUETTE_INNER, SILHOUETTE_OUTER } from "./silhouette";
import cutout from "../../assets/portrait-cutout.webp";
import csaBadge from "../../assets/cert_logo/servicenow_csa.png";
import kotlinLogo from "../../assets/tech_logo/kotlin.svg";
import reactLogo from "../../assets/tech_logo/reactjs.png";
import unityLogo from "../../assets/tech_logo/unity.svg";
import cloudflareLogo from "../../assets/tech_logo/cloudflare.svg";
import firebaseLogo from "../../assets/tech_logo/firebase.png";

// Tech logos floating around the head (kept clear of the face)
const logos = [
  { src: kotlinLogo, alt: "Kotlin", pos: "left-[6%] top-[6%]", depth: 0.8 },
  { src: reactLogo, alt: "React", pos: "left-[82%] top-[2%]", depth: 1.1 },
  { src: unityLogo, alt: "Unity", pos: "left-[90%] top-[28%]", depth: 0.7 },
  { src: cloudflareLogo, alt: "Cloudflare Workers", pos: "left-[-2%] top-[48%]", depth: 1 },
  { src: firebaseLogo, alt: "Firebase", pos: "left-[86%] top-[82%]", depth: 0.9 },
];

const Card = ({ className = "", depth, children }) => (
  <div
    data-depth={depth}
    className={`ps-card ps-layer invisible absolute z-30 flex items-center gap-2 rounded-xl border border-paper/10 bg-ink/75 px-2 py-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2.5 ${className}`}
  >
    {children}
  </div>
);

/**
 * The hero portrait: the real headshot cut out, with a neon light running
 * around its silhouette, a live network graph and light beams behind it,
 * floating tech logos and credential cards. Layers move with the pointer.
 */
const PortraitStage = ({ ready }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.set(".ps-person, .ps-outline", { xPercent: -50 });
      if (!ready) return undefined;
      if (prefersReducedMotion()) {
        gsap.set(".ps-anim, .ps-card, .ps-logo, .ps-outline", { autoAlpha: 1 });
        gsap.set(".ps-comet", { autoAlpha: 0 });
        return undefined;
      }

      // Staged entrance: beams and network fade up, the outline draws itself,
      // the portrait rises into focus, then logos and cards pop in.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".ps-beams", { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 0)
        .fromTo(".ps-network", { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 0.2)
        .fromTo(".ps-person", { autoAlpha: 0, yPercent: 10, filter: "blur(12px)" }, { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 1.6 }, 0.3)
        .set(".ps-outline", { autoAlpha: 1 }, 0.6)
        .fromTo(".ps-trace", { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 2.2, ease: "power3.inOut" }, 0.6)
        .fromTo(".ps-outer", { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 1.4)
        .fromTo(".ps-logo", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2)" }, 1.3)
        .fromTo(".ps-card", { autoAlpha: 0, y: 24, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 0.14, ease: "back.out(1.6)" }, 1.4);

      // Two comets of light travelling the silhouette in opposite directions
      gsap.fromTo(
        ".ps-comet-a",
        { strokeDashoffset: 160 },
        { strokeDashoffset: -1000, duration: 4.5, ease: "power1.inOut", repeat: -1, repeatDelay: 0.4, delay: 2.4 }
      );
      gsap.fromTo(
        ".ps-comet-b",
        { strokeDashoffset: -1000 },
        { strokeDashoffset: 160, duration: 6, ease: "power1.inOut", repeat: -1, repeatDelay: 1.2, delay: 4 }
      );
      // The outer dashed outline slowly marches (starts after it has drawn in)
      const march = gsap.fromTo(".ps-march", { strokeDashoffset: 0 }, { strokeDashoffset: -200, duration: 12, ease: "none", repeat: -1, delay: 2.8 });

      // Logos and cards drift gently
      gsap.utils.toArray(".ps-logo").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 9 : -9, rotation: i % 2 ? 6 : -6, duration: 3 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
      });
      gsap.utils.toArray(".ps-card").forEach((card, i) => {
        gsap.to(card, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 + i * 0.3 });
      });

      // Scrolling quickens the outline for a moment
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
          gsap.to(march, { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to(march, { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });

      // Pointer parallax: deeper layers move less, plus a slight tilt
      if (!isFinePointer()) return undefined;
      const layers = gsap.utils.toArray(".ps-layer").map((el) => ({
        depth: parseFloat(el.dataset.depth || "0.5"),
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
      }));
      const tiltX = gsap.quickTo(root.current, "rotationY", { duration: 1, ease: "power3.out" });
      const tiltY = gsap.quickTo(root.current, "rotationX", { duration: 1, ease: "power3.out" });
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * 36 * l.depth);
          l.y(ny * 20 * l.depth);
        });
        tiltX(nx * 6);
        tiltY(-ny * 4);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <div ref={root} className="relative aspect-[4/5] w-full [perspective:1200px] [transform-style:preserve-3d]">
      {/* Light beams sweeping behind */}
      <div
        aria-hidden="true"
        data-depth="0.15"
        className="ps-beams ps-anim ps-layer invisible absolute inset-[-10%] overflow-hidden [mask-image:radial-gradient(ellipse_at_50%_45%,#000_30%,transparent_72%)]"
      >
        <div className="absolute left-[10%] top-[-20%] h-[140%] w-[22%] rotate-[18deg] animate-[beam_9s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-violet/40 to-transparent blur-2xl motion-reduce:animate-none" />
        <div className="absolute left-[55%] top-[-20%] h-[140%] w-[14%] rotate-[18deg] animate-[beam_12s_ease-in-out_-4s_infinite] bg-gradient-to-b from-transparent via-[#7c6cff]/30 to-transparent blur-2xl motion-reduce:animate-none" />
        <div className="absolute left-[15%] top-[8%] aspect-square w-[70%] rounded-full bg-violet/25 blur-[90px]" />
      </div>

      {/* Live network graph */}
      <div
        aria-hidden="true"
        data-depth="0.35"
        className="ps-network ps-anim ps-layer invisible absolute inset-[-6%] [mask-image:radial-gradient(ellipse_at_50%_45%,#000_40%,transparent_75%)]"
      >
        <NetworkField />
      </div>

      {/* The real photo, cut out */}
      <img
        src={cutout}
        alt="Prabhat Bisht"
        data-depth="0.6"
        className="ps-person portrait-mask ps-anim ps-layer invisible absolute bottom-0 left-1/2 z-[15] w-[88%]"
      />

      {/* Neon light running around the silhouette */}
      <svg
        aria-hidden="true"
        data-depth="0.6"
        viewBox="0 -60 880 1060"
        className="ps-outline portrait-mask ps-layer invisible absolute bottom-0 left-1/2 z-[16] w-[88%] overflow-visible"
      >
        <defs>
          <linearGradient id="ps-neon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c4f542" />
            <stop offset="0.5" stopColor="#e9ffb0" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="ps-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path className="ps-outer ps-march" d={SILHOUETTE_OUTER} pathLength="1000" fill="none" stroke="rgba(167,139,250,0.45)" strokeWidth="1.2" strokeDasharray="3 9" vectorEffect="non-scaling-stroke" />
        <path className="ps-trace" d={SILHOUETTE_INNER} pathLength="1000" fill="none" stroke="rgba(241,239,233,0.22)" strokeWidth="1.2" strokeDasharray="1000" vectorEffect="non-scaling-stroke" />
        <path className="ps-comet ps-comet-a" d={SILHOUETTE_INNER} pathLength="1000" fill="none" stroke="#c4f542" strokeWidth="14" strokeLinecap="round" strokeDasharray="160 2000" strokeDashoffset="160" filter="url(#ps-glow)" opacity="0.7" />
        <path className="ps-comet ps-comet-a" d={SILHOUETTE_INNER} pathLength="1000" fill="none" stroke="url(#ps-neon)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="160 2000" strokeDashoffset="160" vectorEffect="non-scaling-stroke" />
        <path className="ps-comet ps-comet-b" d={SILHOUETTE_INNER} pathLength="1000" fill="none" stroke="#a78bfa" strokeWidth="12" strokeLinecap="round" strokeDasharray="90 2000" strokeDashoffset="-1000" filter="url(#ps-glow)" opacity="0.6" />
        <path className="ps-comet ps-comet-b" d={SILHOUETTE_INNER} pathLength="1000" fill="none" stroke="#d6c9ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="90 2000" strokeDashoffset="-1000" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Floating tech logos */}
      {logos.map((l) => (
        <div key={l.alt} data-depth={l.depth} className={`ps-layer absolute z-20 ${l.pos}`}>
          <span className="ps-logo invisible grid h-10 w-10 place-items-center rounded-2xl border border-paper/15 bg-ink/70 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] backdrop-blur-md md:h-12 md:w-12">
            <img src={l.src} alt="" className="h-5 w-5 object-contain md:h-6 md:w-6" />
          </span>
        </div>
      ))}

      {/* Floating credential cards */}
      <Card depth="1" className="bottom-[16%] left-[-3%] sm:bottom-auto sm:left-[-10%] sm:top-[30%]">
        <img src={csaBadge} alt="" className="h-7 w-7 object-contain sm:h-9 sm:w-9" />
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold sm:text-[13px]">ServiceNow CSA</span>
          <span className="block text-[10px] text-paper/60 sm:text-[11px]">Certified · May 2026</span>
        </span>
      </Card>
      <Card depth="1.2" className="bottom-[3%] right-[-3%] sm:bottom-auto sm:right-[-10%] sm:top-[56%]">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime text-xs font-bold text-ink sm:h-9 sm:w-9 sm:rounded-xl sm:text-[13px]">Q</span>
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold sm:text-[13px]">Quizly</span>
          <span className="block text-[10px] text-paper/60 sm:text-[11px]">Live on Google Play</span>
        </span>
      </Card>
      <Card depth="0.9" className="bottom-[6%] left-[2%] hidden sm:flex">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
        </span>
        <span className="text-[13px] font-medium">2+ yrs at Accenture</span>
      </Card>
    </div>
  );
};

export default PortraitStage;
