"""Generate the portfolio's AI voice intro and its caption timings.

Uses Kokoro (Apache-2.0, https://github.com/hexgrad/kokoro) through kokoro-onnx,
fully offline, no API key.

    pip install kokoro-onnx soundfile
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python scripts/generate-intro-audio.py --models path/to/dir   # holds kokoro-v1.0.onnx + voices-v1.0.bin

Needs ffmpeg on PATH. Writes:
    scripts/build/intro.wav and intro.mp3   (driving audio for the avatar video, not shipped)
    src/assets/avatar/intro-captions.json   ([{start, end, text}] in seconds)
"""
import argparse
import json
import pathlib
import subprocess

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "am_michael"  # male narrator; other options: am_fenrir, am_puck, bm_george
SPEED = 0.98
LANG = "en-us"

# Default English phonemes say "PRAB-at"; this is "pruh-BAHT".
PRONUNCIATIONS = {"pɹˈæbæt": "pɹəbˈɑːt"}

# (caption shown on screen, text spoken, pause after in seconds)
LINES = [
    ("Hi, I'm Prabhat Bisht.", "Hi, I'm Prabhat Bisht.", 0.5),
    ("By day, I'm a ServiceNow developer at Accenture, and a Certified System Administrator.",
     "By day, I'm a ServiceNow developer at Accenture, and a certified system administrator.", 0.35),
    ("I build ITSM and CMDB solutions, Flow Designer automations and REST integrations for a large-scale enterprise.",
     "I build I T S M and CMDB solutions, Flow Designer automations, and REST integrations, for a large-scale enterprise.", 0.55),
    ("By night, I build my own products.", "By night, I build my own products.", 0.4),
    ("Quizly, an AI-powered quiz app, live on Google Play.", "Quizly, an AI-powered quiz app, live on Google Play.", 0.3),
    ("A fully 3D multiplayer game.", "A fully 3D multiplayer game.", 0.3),
    ("And full-stack platforms on Firebase and Cloudflare.", "And full-stack platforms on Firebase and Cloudflare.", 0.55),
    ("Systems that work. Products people enjoy.", "Systems that work. Products people enjoy.", 0.5),
    ("Scroll down and take a look at my work.", "Scroll down, and take a look at my work.", 0.4),
]

LEAD_IN = 0.35  # silence before the first word


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True, type=pathlib.Path)
    root = pathlib.Path(__file__).resolve().parent.parent
    ap.add_argument("--out", default=root / "scripts/build", type=pathlib.Path)
    ap.add_argument("--captions", default=root / "src/assets/avatar/intro-captions.json", type=pathlib.Path)
    args = ap.parse_args()

    kokoro = Kokoro(str(args.models / "kokoro-v1.0.onnx"), str(args.models / "voices-v1.0.bin"))
    chunks, captions = [], []
    sr = 24000
    t = LEAD_IN
    chunks.append(np.zeros(int(LEAD_IN * sr), dtype=np.float32))
    for caption, spoken, pause in LINES:
        phonemes = kokoro.tokenizer.phonemize(spoken, LANG)
        for wrong, right in PRONUNCIATIONS.items():
            phonemes = phonemes.replace(wrong, right)
        samples, sr = kokoro.create(phonemes, voice=VOICE, speed=SPEED, lang=LANG, is_phonemes=True)
        dur = len(samples) / sr
        captions.append({"start": round(t, 3), "end": round(t + dur, 3), "text": caption})
        chunks.append(samples.astype(np.float32))
        chunks.append(np.zeros(int(pause * sr), dtype=np.float32))
        t += dur + pause

    audio = np.concatenate(chunks)
    audio = audio / max(1e-6, np.abs(audio).max()) * 0.89  # peak-normalise to about -1 dBFS
    args.out.mkdir(parents=True, exist_ok=True)
    wav = args.out / "intro.wav"
    sf.write(wav, audio, sr)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1",
         "-codec:a", "libmp3lame", "-b:a", "96k", str(args.out / "intro.mp3")],
        check=True,
    )
    args.captions.parent.mkdir(parents=True, exist_ok=True)
    args.captions.write_text(json.dumps(captions, indent=2), encoding="utf-8")
    print(f"{t:.1f}s, {len(captions)} captions -> {args.out}")


if __name__ == "__main__":
    main()
