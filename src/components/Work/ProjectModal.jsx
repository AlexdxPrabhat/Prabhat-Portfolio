import { useEffect, useRef } from "react";
import { FiArrowUpRight, FiGithub, FiX } from "react-icons/fi";
import { gsap, useGSAP, lockScroll, prefersReducedMotion } from "../../lib/motion";

/** Full-height case panel that rises from the bottom. */
const ProjectModal = ({ project, onClose }) => {
  const root = useRef(null);
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const closing = useRef(false);
  const closeRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced ? 0 : 0.4 });
      gsap.fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: reduced ? 0 : 1, ease: "expo.out" });
      gsap.from(".pm-rise", { y: 40, autoAlpha: 0, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.06, delay: reduced ? 0 : 0.25 });
    },
    { scope: root }
  );

  const close = contextSafe(() => {
    if (closing.current) return;
    closing.current = true;
    const reduced = prefersReducedMotion();
    gsap.to(panel.current, { yPercent: 100, duration: reduced ? 0 : 0.7, ease: "expo.in" });
    gsap.to(root.current, { autoAlpha: 0, duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.25, onComplete: onClose });
  });
  closeRef.current = close;

  useEffect(() => {
    const previous = document.activeElement;
    lockScroll(true);
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        // Keep focus inside the dialog
        const f = panel.current.querySelectorAll("a[href], button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div ref={root} className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/80 backdrop-blur-sm" onClick={close}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[94svh] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-b-0 border-line bg-raised"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-raised/85 px-5 py-4 backdrop-blur-md md:px-10">
          <span className="text-xs uppercase tracking-[0.22em] text-muted">
            {project.year} · {project.status || "Project"}
          </span>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            aria-label="Close project"
            className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-expo hover:rotate-90"
          >
            <FiX aria-hidden="true" className="text-lg" />
          </button>
        </div>

        <div className="px-5 pb-12 md:px-10 md:pb-16">
          <h2 id="pm-title" className="pm-rise display text-[clamp(2.75rem,8vw,6.5rem)]">
            {project.title}
          </h2>
          <p className="pm-rise mt-4 max-w-2xl text-lg text-paper/70 md:text-xl">{project.summary}</p>

          <div className="pm-rise mt-8 overflow-hidden rounded-2xl border border-line bg-surface md:mt-10">
            <img src={project.image} alt={`${project.title} preview`} className="w-full object-cover" />
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <p className="pm-rise leading-relaxed text-paper/75 md:col-span-8 md:text-lg">{project.description}</p>
            <div className="pm-rise md:col-span-4">
              <h3 className="text-xs uppercase tracking-[0.22em] text-muted">Built with</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                {project.webapp && (
                  <a
                    href={project.webapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between rounded-full bg-accent px-6 py-4 font-semibold text-ink"
                  >
                    {project.webappLabel || "View live"}
                    <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between rounded-full border border-line px-6 py-4 font-medium hover:border-paper/40"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FiGithub aria-hidden="true" /> {project.githubLabel || "View code"}
                    </span>
                    <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </a>
                )}
                {!project.webapp && !project.github && (
                  <p className="rounded-2xl border border-line p-4 text-sm text-muted">
                    Source is private. {project.status ? `${project.status}.` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
