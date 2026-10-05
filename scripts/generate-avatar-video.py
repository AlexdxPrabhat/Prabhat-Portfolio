"""Render the hero's talking avatar from the portrait and the intro voice.

Uses SadTalker (https://github.com/OpenTalker/SadTalker, Apache-2.0) locally.
Run generate-intro-audio.py first so scripts/build/intro.wav exists.

    python scripts/generate-avatar-video.py --sadtalker C:/path/to/SadTalker --python C:/path/to/sadtalker/venv/python.exe \
        --portrait path/to/portrait.png

Writes src/assets/avatar/portrait.webp (the untouched photo, shown while idle) and intro.mp4 (speaking, with audio).
Needs ffmpeg on PATH.
"""
import argparse
import glob
import os
import pathlib
import subprocess
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "scripts/build"
ASSETS = ROOT / "src/assets/avatar"
W, H = 720, 900  # 4:5 frame used by the hero


def frame_portrait(src, dst):
    """Centre-crop to 4:5 and resize; the face itself is never altered."""
    im = Image.open(src).convert("RGB")
    target = W / H
    if im.width / im.height > target:
        nw = round(im.height * target)
        im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    else:
        nh = round(im.width / target)
        im = im.crop((0, 0, im.width, nh))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(dst)
    return im


def sadtalker(args, image, audio, out_dir, extra=()):
    cmd = [
        args.python, "inference.py",
        "--driven_audio", str(audio),
        "--source_image", str(image),
        "--result_dir", str(out_dir),
        "--preprocess", "full",
        "--still",
        "--size", str(args.size),
        "--batch_size", "1",
        *extra,
    ]
    if args.enhancer:
        cmd += ["--enhancer", args.enhancer]
    subprocess.run(cmd, cwd=args.sadtalker, check=True)
    return max(glob.glob(str(out_dir / "**/*.mp4"), recursive=True), key=os.path.getmtime)


def ffmpeg(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sadtalker", required=True)
    ap.add_argument("--python", required=True)
    ap.add_argument("--portrait", required=True)
    ap.add_argument("--size", type=int, default=512)
    ap.add_argument("--enhancer", default="", help="e.g. gfpgan (sharper, but can smooth the face)")
    args = ap.parse_args()

    BUILD.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    framed = BUILD / "portrait-4x5.png"
    im = frame_portrait(args.portrait, framed)
    im.save(ASSETS / "portrait.webp", "WEBP", quality=88, method=6)

    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        # Speaking clip, then swap in the clean narration as the audio track
        talk = sadtalker(args, framed, BUILD / "intro.wav", tmp / "talk")
        ffmpeg("-i", talk, "-i", str(BUILD / "intro.wav"), "-map", "0:v:0", "-map", "1:a:0",
               "-vf", f"scale={W}:{H}:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow",
               "-crf", "24", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
               str(ASSETS / "intro.mp4"))

    for f in ("portrait.webp", "intro.mp4"):
        print(f, os.path.getsize(ASSETS / f) // 1024, "KB")


if __name__ == "__main__":
    main()
