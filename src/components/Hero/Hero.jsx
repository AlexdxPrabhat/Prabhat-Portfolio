import { useRef } from "react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, SplitText, ScrollTrigger, scrollToSection, prefersReducedMotion } from "../../lib/motion";
import { profile } from "../../constants";
import MagneticButton from "../ui/MagneticButton";
import AvatarStage from "./AvatarStage";

const roles = ["enterprise workflows", "AI-powered apps", "3D multiplayer games", "full-stack platforms"];
const proof = ["ServiceNow CSA certified", "2+ years at Accenture", "Quizly live on Google Play"];

const Hero = ({ ready }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      const title = root.current.querySelector(".hero-title");

      if (prefersReducedMotion()) {
        gsap.set([title, ".hero-fade", ".hero-stage"], { autoAlpha: 1 });
        gsap.set(".role-word:not(:first-child)", { autoAlpha: 0 });
        return;
      }

      const split = SplitText.create(title, { type: "words,chars", mask: "words" });
      gsap.set(title, { autoAlpha: 1 });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".hero-stage",
          { autoAlpha: 0, clipPath: "inset(18% 12% 18% 12% round 2rem)", scale: 1.08 },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 2rem)", scale: 1, duration: 1.6, ease: "expo.inOut" }
        )
        .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.025 }, 0.35)
        .fromTo(".hero-fade", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.6);

      // Rotating role: each word rises in, holds, and leaves upward.
      const words = gsap.utils.toArray(".role-word");
      gsap.set(words, { yPercent: 110 });
      const loop = gsap.timeline({ repeat: -1, delay: 1.4 });
      words.forEach((w) => {
        loop.to(w, { yPercent: 0, duration: 0.8, ease: "expo.out" }).to(w, { yPercent: -110, duration: 0.6, ease: "expo.in" }, "+=1.6");
      });

      // Gentle depth as the hero scrolls away (side-by-side layout only;
      // on phones the copy sits below the avatar and is still being read)
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
          .to(".hero-copy", { yPercent: -10, autoAlpha: 0.2, ease: "none" }, 0)
          .to(".hero-stage", { yPercent: 8, ease: "none" }, 0);
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [ready], scope: root }
  );

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-24 md:pt-28">
      {/* Faint grid and a soft glow behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(241,239,233,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,239,233,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_75%_65%_at_60%_40%,#000_35%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-8%] top-[8%] h-[75vmin] w-[75vmin] rounded-full bg-violet/20 blur-[130px]" />

      <div className="container-x relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="hero-copy order-2 lg:order-1 lg:col-span-7">
          <p className="hero-fade invisible flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-paper/70 md:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            ServiceNow Developer at Accenture
          </p>

          <p className="hero-fade invisible mt-6 text-2xl text-paper/60 md:mt-8 md:text-3xl">Hi, I&apos;m</p>
          <h1 className="hero-title display invisible mt-2 text-[clamp(3.25rem,8.5vw,8rem)]">
            Prabhat Bisht<span className="text-lime">.</span>
          </h1>

          <p className="hero-fade invisible mt-6 text-xl leading-snug md:mt-8 md:text-3xl">
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
            ServiceNow developer by day, product builder by night. I automate enterprise workflows at Accenture and ship
            apps, games and platforms of my own.
          </p>

          <div className="hero-fade invisible mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <MagneticButton
              onClick={() => scrollToSection("#work")}
              data-cursor="Go"
              className="h-14 rounded-full bg-paper px-7 text-sm font-semibold text-ink"
            >
              View my work <FiArrowDown aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              href={profile.resume}
              className="h-14 rounded-full border border-line px-7 text-sm font-medium text-paper hover:border-paper/40"
            >
              Résumé <FiArrowUpRight aria-hidden="true" />
            </MagneticButton>
          </div>

          <ul className="hero-fade invisible mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/55">
            {proof.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-lime" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="hero-stage invisible mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-[30rem]">
            <AvatarStage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
