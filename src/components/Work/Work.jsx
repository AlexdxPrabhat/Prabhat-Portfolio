import { useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, revealUp, isFinePointer } from "../../lib/motion";
import { projects } from "../../constants";
import SectionHeading from "../ui/SectionHeading";
import ProjectModal from "./ProjectModal";

const featured = projects.filter((p) => p.featured);
const archive = projects.filter((p) => !p.featured);

// Rockstar-style banner card: art on one side, big condensed title on the other.
// Cards are sticky, so each one pins and the next slides up over it.
const StackCard = ({ project, index, onOpen }) => (
  <article className="stack-card sticky" style={{ top: `calc(9svh + ${index * 14}px)` }}>
    <button
      type="button"
      onClick={() => onOpen(project)}
      data-cursor="View"
      aria-label={`Open ${project.title}`}
      className="stack-inner group relative flex w-full origin-top flex-col overflow-hidden rounded-[1.5rem] border border-paper/15 text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:grid md:h-[min(68svh,600px)] md:grid-cols-12 md:rounded-[1.75rem]"
      style={{ background: `linear-gradient(125deg, ${project.palette[0]}, ${project.palette[1]})` }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden md:col-span-7 md:aspect-auto md:h-full">
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading="lazy"
          style={{ objectPosition: project.imagePosition }}
          className="stack-img h-full w-full object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-black/30 md:block" />
      </div>
      <div className="relative flex flex-col gap-3 bg-black/20 p-5 pb-6 md:col-span-5 md:justify-center md:gap-5 md:bg-black/25 md:p-10 lg:p-12">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-paper/80">
          <span className="h-1.5 w-1.5 rounded-full bg-sunset-pink" />
          <span className="md:hidden">{String(index + 1).padStart(2, "0")} ·</span>
          {project.status}
        </p>
        <h3 className="stack-title font-condensed text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.85] tracking-[0.01em]">{project.title}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-paper/85 md:text-base">{project.summary}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-pink px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-500 ease-expo group-hover:translate-x-1">
            View project <FiArrowRight aria-hidden="true" />
          </span>
          <span className="hidden text-xs text-paper/70 md:inline">{project.tags.slice(0, 3).join(" · ")}</span>
        </div>
      </div>
      <span className="absolute right-5 top-5 hidden font-condensed text-xl tracking-[0.1em] text-paper/70 md:block">
        {String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
      </span>
      {/* Darkens as the next card covers this one */}
      <span aria-hidden="true" className="stack-shade pointer-events-none absolute inset-0 bg-black opacity-0" />
    </button>
  </article>
);

const Work = () => {
  const root = useRef(null);
  const preview = useRef(null);
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray(".stack-card");
        cards.forEach((card, i) => {
          const inner = card.querySelector(".stack-inner");
          // Art settles from a slight zoom as the card arrives
          gsap.fromTo(card.querySelector(".stack-img"), { scale: 1.25 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 20%", scrub: true },
          });
          gsap.from(card.querySelector(".stack-title"), {
            yPercent: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 70%", once: true },
          });
          // When the next card slides over, shrink back and dim
          const next = cards[i + 1];
          if (next) {
            gsap
              .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true } })
              .to(inner, { scale: 0.9, ease: "none" }, 0)
              .to(inner.querySelector(".stack-shade"), { opacity: 0.55, ease: "none" }, 0);
          }
        });
      });

      revealUp(".archive-row", { trigger: ".archive", stagger: 0.06, y: 24 });
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0.85, autoAlpha: 0 });
    },
    { scope: root }
  );

  // Archive hover preview that trails the pointer (desktop only)
  const onArchiveMove = contextSafe((e) => {
    if (!isFinePointer()) return;
    gsap.to(preview.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
  });
  const showPreview = contextSafe((p) => {
    if (!isFinePointer()) return;
    setHovered(p);
    gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  });
  const hidePreview = contextSafe(() => {
    gsap.to(preview.current, { autoAlpha: 0, scale: 0.85, duration: 0.3 });
  });

  return (
    <section id="work" ref={root} className="section pb-0">
      <div className="container-x">
        <SectionHeading
          index={4}
          label="Selected work"
          title={
            <>
              Things I&apos;ve <span className="font-serif font-normal italic text-lime">built</span>
            </>
          }
          aside="Five projects I designed, built and shipped end to end."
        />
      </div>

      <div className="stack container-x flex flex-col gap-[14svh] pb-[6svh]">
        {featured.map((p, i) => (
          <StackCard key={p.id} project={p} index={i} onOpen={setOpen} />
        ))}
      </div>

      <div className="archive container-x pb-24 pt-24 md:pb-36 md:pt-32" onPointerMove={onArchiveMove}>
        <div className="flex items-end justify-between border-b border-line pb-6">
          <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">More projects</h3>
          <span className="text-sm text-muted tabular-nums">({String(archive.length).padStart(2, "0")})</span>
        </div>
        <ul onPointerLeave={hidePreview}>
          {archive.map((p) => (
            <li key={p.id} className="archive-row invisible border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(p)}
                onPointerEnter={() => showPreview(p)}
                onFocus={() => setHovered(p)}
                data-cursor="Open"
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-6 text-left transition-[padding] duration-500 ease-expo md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] md:py-8 md:hover:px-4"
              >
                <span className="text-2xl font-medium tracking-[-0.02em] transition-colors group-hover:text-lime md:text-4xl">{p.title}</span>
                <span className="hidden text-paper/60 md:block">{p.summary}</span>
                <span className="hidden text-sm text-muted md:block">{p.tags.slice(0, 3).join(" · ")}</span>
                <span className="flex items-center gap-4 text-sm text-muted">
                  <span className="tabular-nums">{p.year}</span>
                  <FiArrowUpRight aria-hidden="true" className="text-lg text-paper transition-transform duration-500 ease-expo group-hover:rotate-45" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none invisible fixed left-0 top-0 z-[60] hidden h-56 w-80 overflow-hidden rounded-2xl border border-line shadow-2xl md:block"
      >
        {hovered && <img src={hovered.image} alt="" className="h-full w-full object-cover" />}
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
};

export default Work;
