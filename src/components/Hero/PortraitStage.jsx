import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, isFinePointer, prefersReducedMotion } from "../../lib/motion";
import cutout from "../../assets/portrait-cutout.webp";
import csaBadge from "../../assets/cert_logo/servicenow_csa.png";
import kotlinLogo from "../../assets/tech_logo/kotlin.svg";
import reactLogo from "../../assets/tech_logo/reactjs.png";
import unityLogo from "../../assets/tech_logo/unity.svg";
import cloudflareLogo from "../../assets/tech_logo/cloudflare.svg";
import firebaseLogo from "../../assets/tech_logo/firebase.png";

// Logos riding the outer orbit, evenly spaced
const orbit = [
  { src: kotlinLogo, alt: "Kotlin" },
  { src: reactLogo, alt: "React" },
  { src: unityLogo, alt: "Unity" },
  { src: cloudflareLogo, alt: "Cloudflare Workers" },
  { src: firebaseLogo, alt: "Firebase" },
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
 * The hero portrait: the real headshot cut out and layered in front of a
 * glowing arch, with drawn-in orbit rings, travelling logos and floating
 * credential cards. Layers move at different depths with the pointer.
 */
const PortraitStage = ({ ready }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      // Centre these with GSAP so later transforms (parallax, spin) keep the offset
      gsap.set([".ps-glow", ".ps-orbit"], { xPercent: -50, yPercent: -50 });
      gsap.set(".ps-person", { xPercent: -50 });
      if (!ready) return;
      const reduced = prefersReducedMotion();
      if (reduced) {
        gsap.set(".ps-anim, .ps-card, .ps-orbit-item", { autoAlpha: 1 });
        return;
      }

      // Staged entrance
      const rings = gsap.utils.toArray(".ps-ring");
      rings.forEach((r) => {
        const len = r.getTotalLength();
        gsap.set(r, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".ps-glow", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 2 }, 0)
        .fromTo(".ps-arch", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "expo.inOut" }, 0.1)
        .fromTo(".ps-rings", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.5)
        .to(rings, { strokeDashoffset: 0, duration: 2, stagger: 0.15, ease: "power3.inOut" }, 0.5)
        .fromTo(
          ".ps-person",
          { autoAlpha: 0, yPercent: 12, filter: "blur(12px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 1.6 },
          0.55
        )
        .fromTo(".ps-orbit-item", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2)" }, 1.1)
        .fromTo(".ps-card", { autoAlpha: 0, y: 24, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 0.14, ease: "back.out(1.6)" }, 1.2);

      // Continuous motion: spinning rings, orbiting logos (kept upright), bobbing cards
      const spin = gsap.to(".ps-spin", { rotation: 360, duration: 40, ease: "none", repeat: -1, svgOrigin: "200 190" });
      const spinBack = gsap.to(".ps-spin-rev", { rotation: -360, duration: 60, ease: "none", repeat: -1, svgOrigin: "200 190" });
      const orbitTl = gsap.to(".ps-orbit", { rotation: 360, duration: 48, ease: "none", repeat: -1 });
      gsap.to(".ps-orbit-item", { rotation: -360, duration: 48, ease: "none", repeat: -1 });
      gsap.utils.toArray(".ps-card").forEach((card, i) => {
        gsap.to(card, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 + i * 0.3 });
      });

      // Scrolling speeds the rings up for a moment
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
          gsap.to([spin, spinBack, orbitTl], { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to([spin, spinBack, orbitTl], { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });

      // Pointer parallax: deeper layers move less
      if (isFinePointer()) {
        const layers = gsap.utils.toArray(".ps-layer").map((el) => ({
          depth: parseFloat(el.dataset.depth || "0.5"),
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "yPercent", { duration: 0.9, ease: "power3.out" }),
        }));
        const tiltX = gsap.quickTo(root.current, "rotationY", { duration: 1, ease: "power3.out" });
        const tiltY = gsap.quickTo(root.current, "rotationX", { duration: 1, ease: "power3.out" });
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * 36 * l.depth);
            l.y(ny * 4 * l.depth);
          });
          tiltX(nx * 6);
          tiltY(-ny * 4);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
      return undefined;
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <div ref={root} className="relative aspect-[4/5] w-full [perspective:1200px] [transform-style:preserve-3d]">
      {/* Soft glow behind everything */}
      <div
        aria-hidden="true"
        data-depth="0.15"
        className="ps-glow ps-anim ps-layer invisible absolute left-1/2 top-[38%] aspect-square w-[85%] rounded-full bg-violet/30 blur-[90px]"
      />

      {/* Halo disc behind the head with a slow conic shimmer */}
      <div
        aria-hidden="true"
        data-depth="0.25"
        className="ps-arch ps-anim ps-layer invisible absolute left-[11%] top-[6.8%] aspect-square w-[78%] overflow-hidden rounded-full border border-paper/10 bg-gradient-to-b from-[#33236e] via-[#1c1438] to-[#0d0b16]"
      >
        <div className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_14s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(167,139,250,0.28)_40deg,transparent_100deg,transparent_200deg,rgba(196,245,66,0.14)_240deg,transparent_300deg)] motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.3),transparent_65%)]" />
      </div>

      {/* Orbit rings, drawn in on entrance, behind the portrait */}
      <svg
        aria-hidden="true"
        data-depth="0.4"
        viewBox="0 0 400 500"
        className="ps-rings ps-anim ps-layer invisible absolute inset-0 z-10 h-full w-full overflow-visible"
      >
        <g className="ps-spin">
          <circle className="ps-ring" cx="200" cy="190" r="178" fill="none" stroke="rgba(241,239,233,0.16)" strokeWidth="1" strokeDasharray="2 7" />
          <circle cx="200" cy="12" r="4" fill="#c4f542" />
        </g>
        <g className="ps-spin-rev">
          <circle className="ps-ring" cx="200" cy="190" r="140" fill="none" stroke="rgba(167,139,250,0.45)" strokeWidth="1.2" />
          <circle cx="340" cy="190" r="3" fill="#a78bfa" />
        </g>
      </svg>

      {/* Logos travelling along the outer orbit */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[12]">
        <div className="ps-orbit absolute left-1/2 top-[38%] aspect-square w-[89%]">
          {orbit.map((o, i) => {
            const angle = (i / orbit.length) * 2 * Math.PI - Math.PI / 2;
            return (
              <div
                key={o.alt}
                className="absolute -ml-5 -mt-5 md:-ml-6 md:-mt-6"
                style={{ left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%` }}
              >
                <span className="ps-orbit-item invisible grid h-10 w-10 place-items-center rounded-full border border-paper/15 bg-ink/80 shadow-lg backdrop-blur-md md:h-12 md:w-12">
                  <img src={o.src} alt="" className="h-5 w-5 object-contain md:h-6 md:w-6" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* The real photo, cut out, popping out of the arch */}
      <img
        src={cutout}
        alt="Prabhat Bisht"
        data-depth="0.6"
        className="ps-person portrait-mask ps-anim ps-layer invisible absolute bottom-0 left-1/2 z-[15] w-[88%]"
      />

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
