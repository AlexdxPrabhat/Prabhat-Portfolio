import { useRef } from "react";
import { gsap, useGSAP, revealUp, prefersReducedMotion } from "../../lib/motion";
import { experiences } from "../../constants";
import SectionHeading from "../ui/SectionHeading";

const Experience = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      revealUp(".xp-meta > *", { trigger: ".xp-meta", stagger: 0.08 });
      revealUp(".xp-desc", { trigger: ".xp-desc" });
      revealUp(".xp-skill", { trigger: ".xp-skills", stagger: 0.03, y: 16 });
      if (prefersReducedMotion()) {
        gsap.set(".xp-item", { autoAlpha: 1 });
        return;
      }
      gsap.utils.toArray(".xp-item").forEach((item) => {
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: "top 85%", once: true } })
          .set(item, { autoAlpha: 1 })
          .from(item.querySelector(".xp-line"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from(item.querySelectorAll(".xp-rise"), { yPercent: 40, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, "-=0.8");
      });
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="section">
      <div className="container-x">
        <SectionHeading
          index={2}
          label="Experience"
          title={
            <>
              Enterprise work, <span className="font-serif font-normal italic text-lime">shipped</span>
            </>
          }
          aside="Two years delivering ServiceNow ITSM and CMDB solutions for a large-scale enterprise."
        />

        {experiences.map((xp) => (
          <article key={xp.id} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="xp-meta lg:sticky lg:top-28">
                <p className="invisible text-sm uppercase tracking-[0.22em] text-lime">{xp.date}</p>
                <h3 className="invisible mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">{xp.role}</h3>
                <div className="invisible mt-6 flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-paper">
                    <img src={xp.img} alt="" className="h-full w-full object-cover" />
                  </span>
                  <p className="text-paper/70">{xp.company}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="xp-desc invisible text-xl leading-relaxed text-paper/80 md:text-2xl">{xp.desc}</p>
              <ol className="mt-12">
                {xp.highlights.map((h, i) => (
                  <li key={i} className="xp-item invisible relative grid grid-cols-[3rem_1fr] gap-4 py-6 md:grid-cols-[4rem_1fr] md:py-8">
                    <span className="xp-line absolute inset-x-0 top-0 h-px origin-left bg-line" />
                    <span className="xp-rise font-serif text-2xl italic text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <p className="xp-rise leading-relaxed text-paper/75 md:text-lg">{h}</p>
                  </li>
                ))}
              </ol>
              <ul className="xp-skills mt-10 flex flex-wrap gap-2" aria-label="Skills used">
                {xp.skills.map((s) => (
                  <li key={s} className="xp-skill chip invisible">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Experience;
