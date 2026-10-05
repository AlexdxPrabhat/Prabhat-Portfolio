"""Generate the portfolio's AI voice intro and its caption timings.

Uses Kokoro (Apache-2.0, https://github.com/hexgrad/kokoro) through kokoro-onnx,
fully offline, no API key.

    pip install kokoro-onnx soundfile
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python scripts/generate-intro-audio.py --models path/to/dir   # holds kokoro-v1.0.onnx + voices-v1.0.bin

Needs ffmpeg on PATH for the MP3 encode. Writes:
    src/assets/audio/intro.mp3
    src/assets/audio/intro-captions.json   ([{start, end, text}] in seconds)
"""
import argparse
import json
import pathlib
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "af_heart"  # try am_michael or bm_george for a male narrator
SPEED = 0.95
LANG = "en-us"

# Default English phonemes say "PRAB-at"; this is "pruh-BAHT".
PRONUNCIATIONS = {"pɹˈæbæt": "pɹəbˈɑːt"}

# (caption shown on screen, text spoken, pause after in seconds)
LINES = [
    ("Meet Prabhat Bisht.", "Meet Prabhat Bisht.", 0.55),
    ("By day: ServiceNow developer at Accenture, and Certified System Administrator.",
     "By day, ServiceNow developer at Accenture, and certified system administrator.", 0.35),
    ("Building ITSM and CMDB solutions, Flow Designer automations and REST integrations for a large-scale enterprise.",
     "Building I T S M and CMDB solutions, Flow Designer automations, and REST integrations, for a large-scale enterprise.", 0.6),
    ("By night: a builder of products.", "By night, a builder of products.", 0.45),
    ("Quizly, an AI-powered quiz app, live on Google Play.", "Quizly, an AI-powered quiz app, live on Google Play.", 0.3),
    ("A fully 3D multiplayer game.", "A fully 3D multiplayer game.", 0.3),
    ("And full-stack platforms, built on Firebase and Cloudflare.",
     "And full-stack platforms, built on Firebase and Cloudflare.", 0.6),
    ("Systems that work.", "Systems that work.", 0.25),
    ("Products people enjoy.", "Products people enjoy.", 0.55),
    ("Scroll on, and see the work.", "Scroll on, and see the work.", 0.4),
]

LEAD_IN = 0.35  # silence before the first word


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True, type=pathlib.Path)
    ap.add_argument("--out", default=pathlib.Path(__file__).resolve().parent.parent / "src/assets/audio", type=pathlib.Path)
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
    with tempfile.TemporaryDirectory() as tmp:
        wav = pathlib.Path(tmp) / "intro.wav"
        sf.write(wav, audio, sr)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
             "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1",
             "-codec:a", "libmp3lame", "-b:a", "96k", str(args.out / "intro.mp3")],
            check=True,
        )
    (args.out / "intro-captions.json").write_text(json.dumps(captions, indent=2), encoding="utf-8")
    print(f"{t:.1f}s, {len(captions)} captions -> {args.out}")


if __name__ == "__main__":
    main()
