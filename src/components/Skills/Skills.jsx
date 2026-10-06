import { useRef } from "react";
import { useGSAP, revealUp, trackSpotlight } from "../../lib/motion";
import { SkillsInfo } from "../../constants";
import SectionHeading from "../ui/SectionHeading";

// Bento placement on large screens (6-column grid), keyed by category title
const span = {
  ServiceNow: "lg:col-span-4",
  "Mobile & Game Dev": "lg:col-span-2",
  Frontend: "lg:col-span-2",
  "Backend & Cloud": "lg:col-span-2",
  Languages: "lg:col-span-2",
  Tools: "lg:col-span-6",
};

const Skills = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      revealUp(".sk-card", { trigger: ".sk-grid", stagger: 0.08, y: 50 });
      document.querySelectorAll(".sk-card").forEach((card) => {
        revealUp(card.querySelectorAll(".sk-pill"), { trigger: card, stagger: 0.03, y: 14, start: "top 95%" });
      });
    },
    { scope: root }
  );

  return (
    <section id="skills" ref={root} className="section">
      <div className="container-x">
        <SectionHeading
          index={5}
          label="Skills"
          title={
            <>
              The <span className="font-serif font-normal italic text-accent">toolkit</span>
            </>
          }
          aside="From enterprise platforms to native apps, game engines and edge runtimes."
        />

        <div className="sk-grid grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {SkillsInfo.map((cat, i) => (
            <div
              key={cat.title}
              onPointerMove={trackSpotlight}
              className={`sk-card spotlight invisible rounded-3xl border border-line bg-surface/60 p-6 md:p-8 ${span[cat.title] || ""} ${
                cat.title === "Tools" ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-medium tracking-[-0.02em] md:text-2xl">{cat.title}</h3>
                <span className="text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="sk-pill invisible inline-flex items-center gap-2.5 rounded-full border border-line bg-ink/60 py-2 pl-2 pr-4 text-sm text-paper/85 transition-colors duration-300 hover:border-paper/30 hover:text-paper"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-paper/[0.06]">
                      {skill.icon ? (
                        <skill.icon aria-hidden="true" className="h-4 w-4 text-[#62d84e]" />
                      ) : (
                        <img src={skill.logo} alt="" className="h-4 w-4 object-contain" />
                      )}
                    </span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
