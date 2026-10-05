import { useEffect, useRef } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import { useIntro, INTRO_DURATION } from "../Intro/IntroProvider";
import { CaptionText } from "../Intro/IntroControls";
import Eq from "../ui/Eq";
import portrait from "../../assets/avatar/portrait.webp";
import introVideo from "../../assets/avatar/intro.mp4";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/**
 * Framed portrait (the real photo, gently breathing while idle) that
 * crossfades to the talking-avatar video when the intro plays. The video
 * is registered with IntroProvider so other controls can drive it.
 */
const AvatarStage = () => {
  const { status, toggle, registerMedia, setStageVisible } = useIntro();
  const frame = useRef(null);
  const speaking = status !== "idle";
  const playing = status === "playing";

  // Tell the provider when the avatar is off-screen so captions can float
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setStageVisible(entry.intersectionRatio > 0.25), {
      threshold: [0, 0.25, 0.5],
    });
    io.observe(frame.current);
    return () => io.disconnect();
  }, [setStageVisible]);

  return (
    <figure
      ref={frame}
      className="avatar-frame group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(139,92,246,0.45)]"
    >
      <img
        src={portrait}
        alt="Prabhat Bisht"
        className={`absolute inset-0 h-full w-full object-cover ${speaking ? "" : "animate-breathe motion-reduce:animate-none"}`}
      />
      <video
        ref={registerMedia}
        src={introVideo}
        poster={portrait}
        playsInline
        preload="metadata"
        aria-label="AI avatar of Prabhat Bisht giving a short introduction"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${speaking ? "opacity-100" : "opacity-0"}`}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-paper/80 backdrop-blur-md">
        <span className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-lime" : "bg-paper/50"}`} />
        AI avatar
      </span>

      <figcaption className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4">
        {speaking ? (
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-paper/10 bg-ink/65 p-2 backdrop-blur-md md:w-auto md:p-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause intro" : "Resume intro"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-ink"
            >
              {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
            </button>
            {/* On phones the captions move to the floating bar so the mouth stays visible */}
            <CaptionText className="hidden min-h-[2.6em] flex-1 text-sm leading-snug text-paper md:block" />
          </div>
        ) : (
          <button
            type="button"
            onClick={toggle}
            data-cursor="Listen"
            className="flex w-full items-center gap-3 rounded-2xl border border-paper/10 bg-ink/60 p-2.5 pr-4 text-left backdrop-blur-md transition-colors hover:bg-ink/75"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-500 ease-expo group-hover:scale-105">
              <FiPlay aria-hidden="true" className="translate-x-px" />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-medium">Hear my intro</span>
              <span className="block text-xs text-paper/60">{fmt(INTRO_DURATION)} · with captions</span>
            </span>
            <Eq playing={false} className="text-lime" />
          </button>
        )}
      </figcaption>
    </figure>
  );
};

export default AvatarStage;
