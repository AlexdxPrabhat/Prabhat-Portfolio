import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap, useGSAP, ScrollTrigger, scrollToSection, lockScroll, prefersReducedMotion } from "../../lib/motion";
import { profile, socials } from "../../constants";
import { IntroToggle } from "../Intro/IntroControls";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/** Text that rolls up to a duplicate of itself on hover. */
const RollText = ({ children }) => (
  <span className="relative block overflow-hidden">
    <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{children}</span>
    <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0">
      {children}
    </span>
  </span>
);

const Navbar = ({ ready }) => {
  const bar = useRef(null);
  const menu = useRef(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  openRef.current = open;

  // Slide in after the loader; hide on scroll down, return on scroll up.
  useGSAP(
    () => {
      if (!ready) return undefined;
      gsap.fromTo(bar.current, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: "expo.out", delay: 0.6 });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          setScrolled(self.scroll() > 40);
          if (openRef.current) return;
          const hide = self.direction === 1 && self.scroll() > 400;
          gsap.to(bar.current, { yPercent: hide ? -110 : 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
        },
      });
      return () => st.kill();
    },
    { dependencies: [ready] }
  );

  // Highlight the section in view
  useEffect(() => {
    if (!ready) return undefined;
    const triggers = links.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(id),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  // Full-screen menu (below lg)
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      if (open) {
        lockScroll(true);
        gsap.to(bar.current, { yPercent: 0, duration: 0.3 });
        gsap.set(menu.current, { autoAlpha: 1 });
        gsap.fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.9, ease: "expo.inOut" });
        gsap.fromTo(".menu-item", { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.06, delay: reduced ? 0 : 0.35 });
        gsap.fromTo(".menu-foot", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: reduced ? 0 : 0.6 });
      } else if (gsap.getProperty(menu.current, "autoAlpha") > 0) {
        lockScroll(false);
        gsap.to(menu.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: reduced ? 0 : 0.7,
          ease: "expo.inOut",
          onComplete: () => gsap.set(menu.current, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [open], scope: menu }
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => {
    const wasOpen = openRef.current;
    setOpen(false);
    // Let the menu start closing (and unlock scroll) before travelling
    setTimeout(() => scrollToSection(`#${id}`), wasOpen ? 350 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className={`invisible fixed inset-x-0 top-0 z-[75] transition-[background-color,border-color] duration-500 ${
          scrolled && !open ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Primary">
          <button type="button" onClick={() => go("home")} className="group flex items-center gap-3" aria-label="Back to top">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-paper text-[13px] font-bold tracking-tight text-ink transition-transform duration-700 ease-expo group-hover:rotate-[360deg]">
              PB
            </span>
            <span className="hidden text-sm font-medium sm:block">
              <RollText>{profile.name}</RollText>
            </span>
          </button>

          <ul className="hidden items-center gap-1 rounded-full border border-line bg-ink/40 p-1 backdrop-blur-md lg:flex">
            {links.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={active === id ? "true" : undefined}
                  className={`group rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                    active === id ? "bg-paper text-ink" : "text-paper/75 hover:text-paper"
                  }`}
                >
                  <RollText>{label}</RollText>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <IntroToggle />
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden h-10 items-center gap-1.5 rounded-full bg-paper px-4 text-sm font-medium text-ink lg:inline-flex"
            >
              <RollText>Résumé</RollText>
              <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-paper text-ink lg:hidden"
            >
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-expo ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-expo ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="site-menu"
        ref={menu}
        className="invisible fixed inset-0 z-[74] flex flex-col justify-between bg-raised px-[var(--gutter)] pb-8 pt-28 lg:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="space-y-1">
          {links.map(({ id, label }, i) => (
            <li key={id} className="overflow-hidden">
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => go(id)}
                className="menu-item display flex items-baseline gap-4 text-[clamp(3rem,14vw,6rem)]"
              >
                <span className="text-sm font-normal tracking-normal text-muted tabular-nums">0{i + 1}</span>
                <span className={active === id ? "font-serif font-normal italic text-lime" : ""}>{label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="menu-foot flex flex-wrap items-end justify-between gap-6 text-sm text-muted">
          <div className="flex flex-col gap-1">
            <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="text-paper">
              {profile.email}
            </a>
            <span>{profile.location}</span>
          </div>
          <div className="flex gap-4">
            {socials.slice(0, 3).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="hover:text-paper">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
