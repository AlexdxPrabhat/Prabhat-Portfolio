import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

let lenis = null;

/** Smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToSection(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/**
 * Masked line/word reveal for a heading. Returns the SplitText instance so the
 * caller's useGSAP scope can revert it.
 */
export function revealText(el, { type = "lines", trigger, delay = 0, stagger = 0.08, start = "top 85%" } = {}) {
  if (!el) return null;
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }
  const split = SplitText.create(el, {
    type: type === "chars" ? "words,chars" : type === "words" ? "words" : "lines",
    mask: type === "chars" ? "words" : type,
    linesClass: "split-mask",
    autoSplit: type === "lines",
    onSplit(self) {
      const targets = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
      return gsap.from(targets, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: trigger || el, start, once: true },
      });
    },
  });
  gsap.set(el, { autoAlpha: 1 });
  return split;
}

/** Fade-and-rise for a group of elements as they enter the viewport. */
export function revealUp(targets, { trigger, stagger = 0.08, y = 40, start = "top 88%" } = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;
  if (prefersReducedMotion()) {
    gsap.set(els, { autoAlpha: 1 });
    return;
  }
  gsap.fromTo(
    els,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger,
      scrollTrigger: { trigger: trigger || els[0], start, once: true },
    }
  );
}

/** Pointer-tracked spotlight for `.spotlight` cards. */
export function trackSpotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}
