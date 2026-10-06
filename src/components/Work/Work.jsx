import { useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, revealUp, isFinePointer } from "../../lib/motion";
import { projects } from "../../constants";
import SectionHeading from "../ui/SectionHeading";
import ProjectModal from "./ProjectModal";

const featured = projects.filter((p) => p.featured);
const archive = projects.filter((p) => !p.featured);

const ProjectCard = ({ project, index, onOpen }) => (
  <article className="work-card group relative w-full shrink-0 lg:w-[min(56vw,920px,calc((100svh_-_300px)*1.6))]">
    <button
      type="button"
      onClick={() => onOpen(project)}
      data-cursor="View"
      className="block w-full text-left"
      aria-label={`Open ${project.title}`}
    >
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {project.status}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface md:rounded-3xl">
        <div className="work-img h-full w-full">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            style={{ objectPosition: project.imagePosition }}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-105"
          />
        </div>
        <span className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="display text-[clamp(2.25rem,4.5vw,4rem)]">{project.title}</h3>
          <p className="mt-3 max-w-md text-paper/65">{project.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-2 md:max-w-[45%] md:justify-end">
          {project.tags.slice(0, 4).map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </button>
  </article>
);

const Work = () => {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const preview = useRef(null);
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the gallery and translate it sideways with the scroll
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Images drift against the motion for depth
        gsap.utils.toArray(".work-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6, scale: 1.14 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            }
          );
        });
        gsap.from(".work-card", {
          yPercent: 12,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: pin.current, start: "top 70%", once: true },
        });
      });

      // Mobile / tablet / reduced motion: vertical stack with reveals
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray(".work-card").forEach((card) => revealUp(card, { trigger: card, y: 60 }));
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
              Things I&apos;ve <span className="font-serif font-normal italic text-accent">built</span>
            </>
          }
          aside={
            <span className="hidden items-center gap-2 lg:inline-flex">
              Scroll to explore <FiArrowRight aria-hidden="true" />
            </span>
          }
        />
      </div>

      <div ref={pin} className="relative lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden">
        <div ref={track} className="container-x flex flex-col gap-20 lg:w-max lg:max-w-none lg:flex-row lg:gap-16 lg:pr-[20vw]">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={setOpen} />
          ))}
        </div>
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
                <span className="text-2xl font-medium tracking-[-0.02em] transition-colors group-hover:text-accent md:text-4xl">{p.title}</span>
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
