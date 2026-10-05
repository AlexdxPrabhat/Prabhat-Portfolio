import { useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import { gsap, useGSAP, SplitText, scrollToSection, prefersReducedMotion } from "../../lib/motion";
import { profile, socials } from "../../constants";
import LocalTime from "../ui/LocalTime";

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

const Footer = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const mark = root.current.querySelector(".ft-mark");
      if (prefersReducedMotion()) {
        gsap.set(mark, { autoAlpha: 1 });
        return;
      }
      // Giant wordmark rises letter by letter as the footer comes into view
      const split = SplitText.create(mark, { type: "chars", mask: "chars" });
      gsap.set(mark, { autoAlpha: 1 });
      gsap.from(split.chars, {
        yPercent: 100,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: 0.6 },
      });
    },
    { scope: root }
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line pt-16 md:pt-24">
      <div className="container-x grid gap-12 text-sm md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-xs text-paper/70">ServiceNow developer by day, product builder by night. Based in {profile.location}.</p>
          <p className="mt-4 text-muted">
            Local time · <LocalTime />
          </p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <h2 className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">Sitemap</h2>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {nav.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => scrollToSection(`#${n.id}`)} className="link-underline text-paper/80 hover:text-paper">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <h2 className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">Elsewhere</h2>
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline text-paper/80 hover:text-paper">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 md:text-right">
          <button
            type="button"
            onClick={() => scrollToSection("#home")}
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 hover:border-paper/40"
          >
            Back to top
            <FiArrowUp aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      <div className="container-x mt-16 flex items-center justify-between text-xs text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Designed &amp; built in Bengaluru</span>
      </div>

      <p
        aria-hidden="true"
        className="ft-mark display invisible mt-6 select-none whitespace-nowrap text-center text-[17.5vw] leading-[0.78] text-paper/[0.92]"
      >
        Prabhat Bisht
      </p>
    </footer>
  );
};

export default Footer;
