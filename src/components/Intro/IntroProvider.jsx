import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import introUrl from "../../assets/audio/intro.mp3";
import captions from "../../assets/audio/intro-captions.json";
import { audioLevel } from "../../lib/audioLevel";

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
 * Owns the voice intro: playback state, the caption track, and a Web Audio
 * analyser that publishes loudness to `audioLevel` for the hero shader.
 */
export function IntroProvider({ children }) {
  const audioRef = useRef(null);
  const graph = useRef(null);
  const raf = useRef(0);
  const [status, setStatus] = useState("idle"); // idle | playing | paused
  const [index, setIndex] = useState(-1);
  const indexRef = useRef(-1);

  const meter = useCallback(() => {
    const audio = audioRef.current;
    const g = graph.current;
    if (g) {
      g.analyser.getByteTimeDomainData(g.data);
      let sum = 0;
      for (let i = 0; i < g.data.length; i++) {
        const v = (g.data[i] - 128) / 128;
        sum += v * v;
      }
      audioLevel.value = Math.min(1, Math.sqrt(sum / g.data.length) * 3.2);
    } else {
      // No analyser (very old browsers): fake a gentle pulse while speaking
      audioLevel.value = 0.35 + Math.sin(performance.now() / 120) * 0.15;
    }
    const i = captionIndexAt(audio.currentTime);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
    raf.current = requestAnimationFrame(meter);
  }, []);

  const stopMeter = useCallback(() => {
    cancelAnimationFrame(raf.current);
    audioLevel.value = 0;
  }, []);

  const ensureGraph = () => {
    if (graph.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      graph.current = { ctx, analyser, data: new Uint8Array(analyser.fftSize) };
    } catch {
      graph.current = null;
    }
  };

  const play = useCallback(async () => {
    const audio = audioRef.current;
    ensureGraph();
    try {
      await graph.current?.ctx.resume();
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
      setStatus("playing");
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(meter);
    } catch {
      setStatus("idle");
    }
  }, [meter]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setStatus("paused");
    stopMeter();
  }, [stopMeter]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setStatus("idle");
    indexRef.current = -1;
    setIndex(-1);
    stopMeter();
  }, [stopMeter]);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, pause, play]);

  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => stop();
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
      cancelAnimationFrame(raf.current);
    };
  }, [stop]);

  const value = useMemo(
    () => ({
      status,
      toggle,
      stop,
      audioRef,
      caption: index >= 0 ? captions[index] : null,
      captionIndex: index,
      duration: INTRO_DURATION,
    }),
    [status, toggle, stop, index]
  );

  return (
    <IntroContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={introUrl} preload="none" />
    </IntroContext.Provider>
  );
}
