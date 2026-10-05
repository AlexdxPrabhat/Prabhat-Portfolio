import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import captions from "../../assets/avatar/intro-captions.json";

const IntroContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useIntro = () => useContext(IntroContext);

export const INTRO_DURATION = captions[captions.length - 1].end + 0.4;

/** Which caption should be on screen at time t (held through the pause after it). */
function captionIndexAt(t) {
  for (let i = captions.length - 1; i >= 0; i--) {
    if (t >= captions[i].start) return i;
  }
  return -1;
}

/**
 * Owns the talking-avatar intro: playback state and the caption track.
 * The avatar <video> lives in the hero and registers itself here so the
 * navbar toggle and the floating captions can drive it from anywhere.
 */
export function IntroProvider({ children }) {
  const media = useRef(null);
  const raf = useRef(0);
  const indexRef = useRef(-1);
  const [status, setStatus] = useState("idle"); // idle | playing | paused
  const [index, setIndex] = useState(-1);
  const [stageVisible, setStageVisible] = useState(true);

  const setCaption = (i) => {
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
  };

  const tick = useCallback(() => {
    if (media.current) setCaption(captionIndexAt(media.current.currentTime));
    raf.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(async () => {
    const el = media.current;
    if (!el) return;
    try {
      if (el.ended) el.currentTime = 0;
      await el.play();
      setStatus("playing");
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    } catch {
      setStatus("idle");
    }
  }, [tick]);

  const pause = useCallback(() => {
    media.current?.pause();
    cancelAnimationFrame(raf.current);
    setStatus("paused");
  }, []);

  const stop = useCallback(() => {
    const el = media.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    cancelAnimationFrame(raf.current);
    setCaption(-1);
    setStatus("idle");
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, pause, play]);

  // The hero hands over its <video> through this callback ref
  const registerMedia = useCallback(
    (el) => {
      if (media.current) media.current.removeEventListener("ended", stop);
      media.current = el;
      if (el) el.addEventListener("ended", stop);
    },
    [stop]
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const value = useMemo(
    () => ({
      status,
      toggle,
      stop,
      registerMedia,
      mediaRef: media,
      caption: index >= 0 ? captions[index] : null,
      captionIndex: index,
      duration: INTRO_DURATION,
      stageVisible,
      setStageVisible,
    }),
    [status, toggle, stop, registerMedia, index, stageVisible]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
