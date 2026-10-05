import { useRef } from "react";
import { FiArrowUpRight, FiAward } from "react-icons/fi";
import { gsap, useGSAP, revealUp, isFinePointer, prefersReducedMotion } from "../../lib/motion";
import { certifications } from "../../constants";
import SectionHeading from "../ui/SectionHeading";

const Certifications = () => {
  const root = useRef(null);
  const card = useRef(null);
  const [featured, ...micro] = certifications;

  const { contextSafe } = useGSAP(
    () => {
      revealUp(".cert-feature", { trigger: ".cert-feature" });
      revealUp(".cert-row", { trigger: ".cert-rows", stagger: 0.1 });
      if (!prefersReducedMotion()) {
        gsap.from(".cert-badge", {
          rotateY: -90,
          scale: 0.6,
          autoAlpha: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".cert-feature", start: "top 75%", once: true },
        });
      }
    },
    { scope: root }
  );

  // 3D tilt with a moving sheen
  const onMove = contextSafe((e) => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const r = card.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(".cert-badge", { rotateY: px * 24, rotateX: -py * 24, duration: 0.6, ease: "power3.out" });
    gsap.to(".cert-sheen", { xPercent: px * 120, autoAlpha: 1, duration: 0.6 });
  });
  const onLeave = contextSafe(() => {
    gsap.to(".cert-badge", { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" });
    gsap.to(".cert-sheen", { autoAlpha: 0, duration: 0.6 });
  });

  return (
    <section id="certifications" ref={root} className="section">
      <div className="container-x">
        <SectionHeading
          index={3}
          label="Certifications"
          title={
            <>
              Certified on the <span className="font-serif font-normal italic text-lime">platform</span>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <div
            ref={card}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className="cert-feature invisible relative overflow-hidden rounded-3xl border border-line bg-surface p-8 md:p-12 lg:col-span-7"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
            <div className="relative flex flex-col gap-10 md:flex-row md:items-center">
              <div className="relative mx-auto shrink-0 [perspective:900px] md:mx-0">
                <div className="cert-badge relative h-44 w-44 [transform-style:preserve-3d] md:h-56 md:w-56">
                  <img src={featured.img} alt={`${featured.title} badge`} className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(98,216,78,0.25)]" />
                  <span
                    aria-hidden="true"
                    className="cert-sheen pointer-events-none invisible absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-lime">
                  {featured.issuer} · {featured.date}
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">{featured.title}</h3>
                <a
                  href={featured.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Verify"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink"
                >
                  Verify on Credly
                  <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
                </a>
              </div>
            </div>
          </div>

          <ul className="cert-rows flex flex-col gap-6 lg:col-span-5">
            {micro.map((c) => (
              <li key={c.id} className="cert-row invisible flex flex-1 items-center gap-5 rounded-3xl border border-line p-6 md:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-soft">
                  <FiAward aria-hidden="true" className="text-xl" />
                </span>
                <div>
                  <h3 className="text-lg font-medium leading-snug md:text-xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {c.issuer} · {c.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
