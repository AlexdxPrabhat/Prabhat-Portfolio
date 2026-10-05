import { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "../../lib/motion";
import { education } from "../../constants";
import SectionHeading from "../ui/SectionHeading";

const Education = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray(".edu-row");
      if (prefersReducedMotion()) {
        gsap.set(rows, { autoAlpha: 1 });
        return;
      }
      rows.forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
          .set(row, { autoAlpha: 1 })
          .from(row.querySelector(".edu-line"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from(row.querySelectorAll(".edu-rise"), { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, "-=0.8");
      });
    },
    { scope: root }
  );

  return (
    <section id="education" ref={root} className="section">
      <div className="container-x">
        <SectionHeading
          index={6}
          label="Education"
          title={
            <>
              Always <span className="font-serif font-normal italic text-lime">learning</span>
            </>
          }
        />

        <ol>
          {education.map((edu) => (
            <li key={edu.id} className="edu-row invisible relative">
              <span className="edu-line absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <details className="group" onToggle={() => ScrollTrigger.refresh()}>
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10 [&::-webkit-details-marker]:hidden">
                  <span className="edu-rise text-sm text-muted tabular-nums md:col-span-3">{edu.date}</span>
                  <span className="edu-rise col-span-2 row-start-2 md:col-span-6 md:row-start-auto">
                    <span className="block text-2xl font-medium leading-tight tracking-[-0.02em] md:text-3xl">{edu.degree}</span>
                    <span className="mt-2 block text-paper/60">{edu.school}</span>
                  </span>
                  <span className="edu-rise col-start-2 row-start-1 flex items-center justify-end gap-4 md:col-span-3 md:col-start-auto md:row-start-auto">
                    <span className="rounded-full border border-line px-3 py-1 text-sm text-lime">{edu.grade}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-line transition-transform duration-500 ease-expo group-open:rotate-45">
                      <FiPlus aria-hidden="true" />
                      <span className="sr-only">Toggle details</span>
                    </span>
                  </span>
                </summary>
                <p className="max-w-3xl pb-10 leading-relaxed text-paper/60 md:ml-[25%] md:pl-8">{edu.desc}</p>
              </details>
            </li>
          ))}
        </ol>
        <div className="h-px bg-line" />
      </div>
    </section>
  );
};

export default Education;
