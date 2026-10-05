import { useEffect, useRef } from "react";
import { FiPause, FiPlay, FiX } from "react-icons/fi";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/motion";
import { useIntro } from "./IntroProvider";
import Eq from "../ui/Eq";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Large "Play my intro" button used in the hero. */
export const IntroButton = ({ className = "" }) => {
  const { status, toggle, duration } = useIntro();
  const playing = status === "playing";
  const label = playing ? "Pause intro" : status === "paused" ? "Resume intro" : "Play my intro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      data-cursor={playing ? "Pause" : "Listen"}
      className={`group inline-flex items-center gap-3 rounded-full border border-line bg-paper/[0.04] py-2 pl-2 pr-5 backdrop-blur-md transition-colors hover:border-paper/30 ${className}`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink transition-transform duration-500 ease-expo group-hover:scale-110">
        {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" className="translate-x-px" />}
      </span>
      <span className="text-left leading-tight">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted">AI voice · {fmt(duration)}</span>
      </span>
      <Eq playing={playing} className="ml-1 text-lime" />
    </button>
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
      aria-label={playing ? "Pause voice intro" : "Play voice intro"}
      className={`inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs uppercase tracking-[0.18em] text-paper/80 transition-colors hover:border-paper/30 hover:text-paper ${className}`}
    >
      <Eq playing={playing} className={playing ? "text-lime" : "text-paper/60"} />
      <span>{playing ? "On" : "Intro"}</span>
    </button>
  );
};

/** Floating caption bar shown while the intro plays. */
export const IntroCaptions = () => {
  const { status, caption, captionIndex, audioRef, duration, toggle, stop } = useIntro();
  const root = useRef(null);
  const bar = useRef(null);
  const textRef = useRef(null);
  const visible = status !== "idle";

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      gsap.to(root.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 30,
        duration: reduced ? 0 : 0.7,
        ease: "expo.out",
      });
    },
    { dependencies: [visible], scope: root }
  );

  // New caption: words drift in from a soft blur
  useGSAP(
    () => {
      if (!textRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        textRef.current.querySelectorAll("span"),
        { autoAlpha: 0, y: 8, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.035, ease: "power3.out" }
      );
    },
    { dependencies: [captionIndex], scope: root }
  );

  useEffect(() => {
    if (status !== "playing") return undefined;
    let id;
    const tick = () => {
      const a = audioRef.current;
      if (bar.current && a) bar.current.style.transform = `scaleX(${Math.min(1, a.currentTime / duration)})`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [status, audioRef, duration]);

  return (
    <div
      ref={root}
      role="region"
      aria-label="Voice intro captions"
      className="invisible fixed inset-x-0 bottom-4 z-[70] mx-auto w-[min(560px,calc(100%_-_1.5rem))] opacity-0 md:bottom-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink/75 px-4 py-3 shadow-2xl backdrop-blur-xl md:px-5 md:py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={status === "playing" ? "Pause intro" : "Resume intro"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime text-ink"
          >
            {status === "playing" ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
          </button>
          <p aria-live="polite" ref={textRef} key={captionIndex} className="min-h-[2.6em] flex-1 text-sm leading-snug text-paper md:text-base">
            {(caption?.text ?? "…").split(" ").map((w, i) => (
              <span key={i} className="inline-block whitespace-pre">
                {w}{" "}
              </span>
            ))}
          </p>
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
