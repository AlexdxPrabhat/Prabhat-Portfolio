import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, SplitText, revealUp, prefersReducedMotion } from "../../lib/motion";
import { profile, stats } from "../../constants";
import profileImage from "../../assets/profile2.webp";

const About = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      revealUp(".ab-eyebrow, .ab-copy, .ab-cta", { trigger: root.current });
      revealUp(".stat", { trigger: ".stats", stagger: 0.1 });

      if (reduced) {
        gsap.set(".ab-statement", { autoAlpha: 1 });
        return;
      }

      // Statement lights up word by word as it scrolls through the viewport
      const split = SplitText.create(".ab-statement", { type: "words" });
      gsap.set(".ab-statement", { autoAlpha: 1 });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ".ab-statement", start: "top 80%", end: "bottom 40%", scrub: true },
        }
      );

      // Portrait: wipe in, then drift
      gsap.fromTo(
        ".ab-photo",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".ab-photo", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".ab-photo img",
        { yPercent: -3, scale: 1.06 },
        { yPercent: 3, scale: 1.06, ease: "none", scrollTrigger: { trigger: ".ab-photo", start: "top bottom", end: "bottom top", scrub: true } }
      );

      // Count-up numbers
      gsap.utils.toArray(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("en-US");
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="section">
      <div className="container-x">
        <p className="ab-eyebrow eyebrow invisible">
          <span className="tabular-nums">(01)</span> About
        </p>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <figure className="ab-photo relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-3xl bg-surface sm:max-w-sm lg:mx-0 lg:max-w-none">
              <img
                src={profileImage}
                alt="Portrait of Prabhat Bisht"
                loading="lazy"
                className="h-full w-full object-cover object-[50%_20%]"
              />
              <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-ink/60 px-4 py-2 text-xs text-paper/80 backdrop-blur-md">
                <span>{profile.name}</span>
                <span>{profile.location}</span>
              </figcaption>
            </figure>
          </div>

          <div className="lg:col-span-8">
            <p className="ab-statement invisible text-[clamp(1.75rem,4.2vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.03em]">
              I build enterprise workflows at Accenture{" "}
              <span className="font-serif font-normal italic text-accent">by day</span> and ship my own products{" "}
              <span className="font-serif font-normal italic text-accent">by night</span>: AI-powered apps, a 3D multiplayer
              game and full-stack platforms on Firebase and Cloudflare.
            </p>

            <div className="mt-12 grid gap-8 text-paper/65 md:grid-cols-2 md:gap-10 lg:mt-16">
              <p className="ab-copy invisible leading-relaxed">
                As a ServiceNow developer and Certified System Administrator, I deliver Service Catalog items, Flow
                Designer automation, scripting and REST integrations in Agile sprints, from development to production.
              </p>
              <p className="ab-copy invisible leading-relaxed">
                Outside work I design, build and ship end to end: Kotlin and Jetpack Compose on Android, React and Astro
                on the web, Unity for games, with Firebase and Cloudflare Workers behind them.
              </p>
            </div>

            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ab-cta link-underline invisible mt-10 inline-flex items-center gap-2 text-lg"
            >
              Download my résumé <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <dl className="stats mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:mt-28 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat invisible flex flex-col-reverse justify-end bg-ink p-5 md:p-8">
              <dt className="mt-3 max-w-[16rem] text-sm text-muted">{s.label}</dt>
              <dd className="display text-[clamp(2.25rem,6vw,5rem)]">
                <span className="text-muted">{s.prefix}</span>
                <span className="stat-num tabular-nums" data-value={s.value}>
                  {s.value.toLocaleString("en-US")}
                </span>
                <span className="text-accent">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default About;
