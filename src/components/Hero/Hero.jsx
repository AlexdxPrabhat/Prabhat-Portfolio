import { useRef } from "react";
import { FiArrowDown } from "react-icons/fi";
import { gsap, useGSAP, SplitText, ScrollTrigger, scrollToSection, prefersReducedMotion } from "../../lib/motion";
import ShaderBackground from "./ShaderBackground";
import RotatingBadge from "./RotatingBadge";
import MagneticButton from "../ui/MagneticButton";
import LocalTime from "../ui/LocalTime";
import { IntroButton } from "../Intro/IntroControls";

const roles = ["enterprise workflows", "AI-powered apps", "3D multiplayer games", "full-stack platforms"];

const Hero = ({ ready }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      const reduced = prefersReducedMotion();
      const title = root.current.querySelector(".hero-title");

      if (reduced) {
        gsap.set([title, ".hero-fade"], { autoAlpha: 1 });
        gsap.set(".role-word:not(:first-child)", { autoAlpha: 0 });
        return;
      }

      const split = SplitText.create(title.querySelectorAll(".hero-line"), { type: "chars", mask: "chars" });
      gsap.set(title, { autoAlpha: 1 });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.035 })
        .fromTo(".hero-fade", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, "-=1.0")
        .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.4 }, "<");

      // Rotating role: each word rises in, holds, and leaves upward.
      const words = gsap.utils.toArray(".role-word");
      gsap.set(words, { yPercent: 110 });
      const loop = gsap.timeline({ repeat: -1, delay: 1.2 });
      words.forEach((w) => {
        loop
          .to(w, { yPercent: 0, duration: 0.8, ease: "expo.out" })
          .to(w, { yPercent: -110, duration: 0.6, ease: "expo.in" }, "+=1.6");
      });

      // Parallax out as the page scrolls past the hero
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".hero-title", { yPercent: -18, ease: "none" }, 0)
        .to(".hero-content", { autoAlpha: 0.15, ease: "none" }, 0)
        .to(".hero-bg", { scale: 1.12, yPercent: 8, ease: "none" }, 0);

      // Splitting can nudge the hero's height; re-measure every trigger below it
      ScrollTrigger.refresh();
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
      <div className="hero-bg absolute inset-0 origin-top">
        <ShaderBackground />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />

      <div className="hero-content container-x relative z-10 flex flex-1 flex-col pb-6 pt-24 md:pb-8 md:pt-28">
        <div className="hero-fade invisible flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-paper/70 md:text-xs">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            ServiceNow Developer at Accenture
          </span>
          <span className="hidden sm:block">Certified System Administrator</span>
        </div>

        <div className="relative mt-auto pt-16">
          <div className="hero-fade invisible absolute right-0 top-[18%] hidden md:block">
            <RotatingBadge />
          </div>
          <h1 className="hero-title display invisible text-[min(22vw,26svh,15rem)]" aria-label="Prabhat Bisht">
            <span className="hero-line block">Prabhat</span>
            <span className="hero-line block pl-[9vw] font-serif font-normal italic tracking-[-0.02em]">
              Bisht<span className="text-lime">.</span>
            </span>
          </h1>

          <div className="hero-rule mt-8 h-px origin-left bg-line md:mt-12" />

          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7 lg:col-span-6">
              <p className="hero-fade invisible text-xl leading-snug md:text-3xl">
                I build{" "}
                <span className="relative inline-grid overflow-hidden align-bottom">
                  {roles.map((r, i) => (
                    <span
                      key={r}
                      aria-hidden={i > 0 ? "true" : undefined}
                      className="role-word col-start-1 row-start-1 whitespace-nowrap font-serif italic text-lime"
                    >
                      {r}
                    </span>
                  ))}
                </span>
              </p>
              <p className="hero-fade invisible mt-4 max-w-xl text-base leading-relaxed text-paper/65 md:text-lg">
                ServiceNow developer by day, product builder by night. I automate enterprise workflows at Accenture and
                ship apps, games and platforms of my own.
              </p>
            </div>
            <div className="hero-fade invisible flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end lg:col-span-6">
              <MagneticButton
                onClick={() => scrollToSection("#work")}
                data-cursor="Go"
                className="h-14 rounded-full bg-paper px-7 text-sm font-semibold text-ink"
              >
                View my work <FiArrowDown aria-hidden="true" />
              </MagneticButton>
              <IntroButton />
            </div>
          </div>
        </div>

        <div className="hero-fade invisible mt-10 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-paper/60 md:text-xs">
          <span>
            Bengaluru · <LocalTime />
          </span>
          <button type="button" onClick={() => scrollToSection("#about")} className="group flex items-center gap-3">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-paper motion-reduce:animate-none" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
