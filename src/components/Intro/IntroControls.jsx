import { useEffect, useRef, useState } from "react";
import { FiPause, FiPlay, FiX } from "react-icons/fi";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/motion";
import { useIntro } from "./IntroProvider";
import Eq from "../ui/Eq";
import poster from "../../assets/avatar/portrait.webp";

/** Caption line whose words drift in each time the caption changes. */
export const CaptionText = ({ className = "" }) => {
  const { caption, captionIndex } = useIntro();
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current.querySelectorAll("span"),
        { autoAlpha: 0, y: 8, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.035, ease: "power3.out" }
      );
    },
    { dependencies: [captionIndex] }
  );

  return (
    <p aria-live="polite" ref={ref} key={captionIndex} className={className}>
      {(caption?.text ?? "…").split(" ").map((w, i) => (
        <span key={i} className="inline-block whitespace-pre">
          {w}{" "}
        </span>
      ))}
    </p>
  );
};

/** Compact toggle for the navbar. */
export const IntroToggle = ({ className = "" }) => {
  const { status, toggle } = useIntro();
  const playing = status === "playing";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause my intro" : "Play my intro"}
      className={`inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs uppercase tracking-[0.18em] text-paper/80 transition-colors hover:border-paper/30 hover:text-paper ${className}`}
    >
      <Eq playing={playing} className={playing ? "text-lime" : "text-paper/60"} />
      <span>{playing ? "On" : "Intro"}</span>
    </button>
  );
};

const useIsPhone = () => {
  const query = "(max-width: 767px)";
  const [phone, setPhone] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
};

/**
 * Floating caption bar, shown while the intro plays and either the avatar
 * has been scrolled out of view or the screen is too small for in-frame captions.
 */
export const IntroCaptions = () => {
  const { status, stageVisible, mediaRef, duration, toggle, stop } = useIntro();
  const root = useRef(null);
  const bar = useRef(null);
  const phone = useIsPhone();
  const visible = status !== "idle" && (!stageVisible || phone);

  useGSAP(
    () => {
      gsap.to(root.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 30,
        duration: prefersReducedMotion() ? 0 : 0.6,
        ease: "expo.out",
      });
    },
    { dependencies: [visible], scope: root }
  );

  useEffect(() => {
    if (status !== "playing") return undefined;
    let id;
    const loop = () => {
      const el = mediaRef.current;
      if (bar.current && el) bar.current.style.transform = `scaleX(${Math.min(1, el.currentTime / duration)})`;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [status, mediaRef, duration]);

  return (
    <div
      ref={root}
      role="region"
      aria-label="Intro captions"
      className="invisible fixed inset-x-0 bottom-4 z-[70] mx-auto w-[min(600px,calc(100%_-_1.5rem))] opacity-0 md:bottom-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink/80 py-3 pl-3 pr-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={status === "playing" ? "Pause intro" : "Resume intro"}
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-lime"
          >
            <img src={poster} alt="" className="h-full w-full object-cover object-[50%_25%]" />
            <span className="absolute inset-0 grid place-items-center bg-ink/40 text-paper">
              {status === "playing" ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
            </span>
          </button>
          <CaptionText className="min-h-[2.6em] flex-1 text-sm leading-snug text-paper" />
          <button
            type="button"
            onClick={stop}
            aria-label="Stop intro"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-paper/70 hover:text-paper"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-line">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
        </div>
      </div>
    </div>
  );
};
