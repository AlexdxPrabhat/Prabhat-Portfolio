import { useEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "../lib/motion";

/**
 * Dot + trailing ring. Elements with data-cursor="Label" grow the ring and
 * show the label; links and buttons get a smaller grow.
 */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return undefined;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    let shown = false;
    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    let current = null;
    const onOver = (e) => {
      const labelled = e.target.closest("[data-cursor]");
      const interactive = labelled || e.target.closest("a, button, [role='button'], input, textarea, label");
      if (interactive === current) return;
      current = interactive;
      if (labelled) {
        label.current.textContent = labelled.dataset.cursor;
        gsap.to(ring.current, { width: 96, height: 96, backgroundColor: "#c4f542", borderColor: "#c4f542", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { autoAlpha: 1, scale: 1, duration: 0.3, delay: 0.05 });
        gsap.to(dot.current, { scale: 0, duration: 0.2 });
      } else if (interactive) {
        gsap.to(ring.current, { width: 56, height: 56, backgroundColor: "rgba(241,239,233,0.06)", borderColor: "rgba(241,239,233,0.5)", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
        gsap.to(dot.current, { scale: 0.6, duration: 0.2 });
      } else {
        gsap.to(ring.current, { width: 32, height: 32, backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(241,239,233,0.35)", duration: 0.45, ease: "expo.out" });
        gsap.to(label.current, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
        gsap.to(dot.current, { scale: 1, duration: 0.2 });
      }
    };
    const onLeaveWindow = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring.current, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor pointer-events-none fixed inset-0 z-[95]">
      <div
        ref={ring}
        className="invisible fixed left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-paper/35"
      >
        <span ref={label} className="invisible scale-50 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink" />
      </div>
      <div ref={dot} className="invisible fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper" />
    </div>
  );
};

export default Cursor;
