#!/usr/bin/env python3
"""Build the hero loop, portrait still and OG image from the intro video.

Usage:
    python3 scripts/build-hero-assets.py [assets/intro.mp4] [--crop W:H:X:Y]

Needs ffmpeg (with libx264, libvpx-vp9, libopus, libwebp) and numpy.
ffmpeg is looked up via $FFMPEG, then PATH, then the imageio-ffmpeg wheel.

Outputs:
    public/hero/hero.mp4   H.264 + AAC, seamless loop
    public/hero/hero.webm  VP9 + Opus, seamless loop
    public/hero/hero-poster.webp  first loop frame (LCP poster)
    public/portrait-bust.webp  480x600 head-to-shirt still
    public/og.jpg              1200x630 share image
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_W, OUT_H = 768, 960          # hero aspect 4:5
LOOP_SECONDS = 10.0              # use about the first 10 s
FADE = 0.5                       # loop cross-fade length (s)
SR = 48000
PAPER = "0xf4f2ee"
WHITEN = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"   # default; tuned per video in main()


def find_ffmpeg():
    exe = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found: install it (brew install ffmpeg) or `pip install imageio-ffmpeg`.")


FF = find_ffmpeg()


def ff(*args, **kw):
    return subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True, **kw)


def probe(src):
    """Return (width, height, fps, duration) parsed from ffmpeg's banner (no ffprobe needed)."""
    err = subprocess.run([FF, "-hide_banner", "-i", src], capture_output=True, text=True).stderr
    import re
    w, h = map(int, re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", err).groups())
    fps = float(re.search(r"([\d.]+) fps", err).group(1))
    hh, mm, ss = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).groups()
    return w, h, fps, int(hh) * 3600 + int(mm) * 60 + float(ss)


def gray_frames(src, w, h, n=12, dur=LOOP_SECONDS):
    """Decode n evenly spaced grayscale frames as a (n, h, w) uint8 array."""
    rate = n / dur
    raw = ff("-t", str(dur), "-i", src, "-vf", f"fps={rate},format=gray",
             "-frames:v", str(n), "-f", "rawvideo", "-", capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w)


def detect_person(frames):
    """Bounding box (x0, y0, x1, y1) of the dark figure nearest the frame centre."""
    darkest = frames.min(axis=0)                      # union of the figure across frames
    mask = darkest < 205
    h, w = mask.shape
    cols = mask.sum(axis=0) > h * 0.02
    # walk out from the centre column so logos / watermarks at the edges are ignored
    cx = int(np.argmax(cols[w // 4: 3 * w // 4])) + w // 4 if not cols[w // 2] else w // 2
    x0 = x1 = cx
    gap = int(w * 0.02)
    while x0 > 0 and cols[max(0, x0 - gap):x0].any():
        x0 -= 1
    while x1 < w - 1 and cols[x1:min(w, x1 + gap)].any():
        x1 += 1
    rows = np.where(mask[:, x0:x1].sum(axis=1) > 2)[0]
    return x0, int(rows[0]), x1, int(rows[-1])


def body_crop(box, w, h):
    """Tight 4:5 crop, head to toe, horizontally centred on the person."""
    x0, y0, x1, y1 = box
    pad = int((y1 - y0) * 0.05)
    ch = min(h, (y1 - y0) + 2 * pad)
    cw = int(round(ch * OUT_W / OUT_H)) // 2 * 2
    ch = ch // 2 * 2
    cx = (x0 + x1) // 2
    x = min(max(0, cx - cw // 2), w - cw)
    y = min(max(0, y0 - pad), h - ch)
    return cw, ch, x, y


def head_crop(frame, box):
    """480x600 head-to-shirt crop centred on the head."""
    x0, y0, x1, y1 = box
    ph = y1 - y0
    top = frame[y0:y0 + int(ph * 0.12), x0:x1] < 205
    cols = np.where(top.any(axis=0))[0]
    hx = x0 + int(cols.mean()) if len(cols) else (x0 + x1) // 2
    ch = int(ph * 0.46) // 2 * 2
    cw = int(ch * 0.8) // 2 * 2
    h, w = frame.shape
    x = min(max(0, hx - cw // 2), w - cw)
    y = min(max(0, y0 - int(ph * 0.04)), h - ch)
    return cw, ch, x, y


def sharpest_frame(frames):
    """Index of the frame with the highest Laplacian variance (least motion blur)."""
    def lap_var(f):
        f = f.astype(np.float32)
        lap = -4 * f[1:-1, 1:-1] + f[:-2, 1:-1] + f[2:, 1:-1] + f[1:-1, :-2] + f[1:-1, 2:]
        return lap.var()
    return int(np.argmax([lap_var(f) for f in frames]))


def build_audio(src, dur, path):
    """Seamless audio loop: clip[F:D] with its last F seconds cross-faded into clip[0:F]."""
    raw = ff("-t", str(dur), "-i", src, "-vn", "-ac", "2", "-ar", str(SR),
             "-f", "f32le", "-", capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
    total = int(round(dur * SR))
    if len(a) < total:                                # pad if the stream is a hair short
        a = np.vstack([a, np.zeros((total - len(a), 2), np.float32)])
    a = a[:total]
    n = int(round(FADE * SR))
    body = a[n:].copy()                               # length D - F, same timing as the video
    t = (np.arange(n, dtype=np.float32) + 0.5) / n
    fade_out, fade_in = np.cos(t * np.pi / 2)[:, None], np.sin(t * np.pi / 2)[:, None]
    body[-n:] = a[total - n:] * fade_out + a[:n] * fade_in   # equal-power, sample accurate
    pcm = (np.clip(body, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())
    return len(body) / SR


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", nargs="?", default=os.path.join(ROOT, "assets", "intro.mp4"))
    ap.add_argument("--crop", help="override detection, W:H:X:Y in source pixels")
    ap.add_argument("--photo", help="optional photo to use for the portrait still")
    args = ap.parse_args()

    w, h, fps, total = probe(args.src)
    dur = min(LOOP_SECONDS, total)
    dur = int(dur * fps) / fps                        # frame-aligned
    frames = gray_frames(args.src, w, h)
    box = detect_person(frames)

    # whiten: map the measured backdrop level to pure white (0.98 is enough for a clean
    # white wall; this AI-rendered backdrop sits at ~240/255, so it needs ~0.92)
    global WHITEN
    bg = np.median(np.concatenate([frames[:, :, :box[0]].ravel(), frames[:, :, box[2]:].ravel()]))
    imax = round(min(0.98, bg / 255 - 0.015), 3)
    WHITEN = f"colorlevels=rimax={imax}:gimax={imax}:bimax={imax}"

    if args.crop:
        cw, ch, x, y = map(int, args.crop.split(":"))
    else:
        cw, ch, x, y = body_crop(box, w, h)
    crop = f"crop={cw}:{ch}:{x}:{y}"
    print(f"source {w}x{h}@{fps} {total:.2f}s | person box {box} | {crop} | backdrop {bg:.0f} -> {WHITEN} | loop {dur - FADE:.2f}s")

    hero = os.path.join(ROOT, "public", "hero")
    os.makedirs(hero, exist_ok=True)

    # video: crop, scale, whiten, then fade the tail of clip[F:D] into clip[0:F]
    vf = (f"[0:v]trim=0:{dur},setpts=PTS-STARTPTS,fps={fps},{crop},"
          f"scale={OUT_W}:{OUT_H}:flags=lanczos,{WHITEN},format=yuv420p,split[a][b];"
          f"[a]trim={FADE}:{dur},setpts=PTS-STARTPTS,fps={fps}[x];"
          f"[b]trim=0:{FADE},setpts=PTS-STARTPTS,fps={fps}[y];"
          f"[x][y]xfade=transition=fade:duration={FADE}:offset={dur - 2 * FADE},format=yuv420p[v]")

    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "loop.wav")
        alen = build_audio(args.src, dur, wav)
        common = ["-i", args.src, "-i", wav, "-filter_complex", vf, "-map", "[v]", "-map", "1:a",
                  "-t", f"{alen:.4f}"]
        ff(*common, "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", os.path.join(hero, "hero.mp4"))
        ff(*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
           "-c:a", "libopus", "-b:a", "80k", os.path.join(hero, "hero.webm"))

    # poster = first frame of the loop, so there is no jump when playback starts
    ff("-i", os.path.join(hero, "hero.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "72",
       os.path.join(hero, "hero-poster.webp"))

    # portrait still from the sharpest sampled frame (or a supplied photo)
    portrait = os.path.join(ROOT, "public", "portrait-bust.webp")
    if args.photo:
        ff("-i", args.photo, "-vf", f"scale=480:600:force_original_aspect_ratio=increase,"
           f"crop=480:600,{WHITEN}", "-frames:v", "1", "-c:v", "libwebp", "-quality", "86", portrait)
    else:
        i = sharpest_frame(frames)
        pw, ph, px, py = head_crop(frames[i], box)
        at = i * dur / len(frames)
        ff("-ss", f"{at:.3f}", "-i", args.src, "-vf",
           f"crop={pw}:{ph}:{px}:{py},scale=480:600:flags=lanczos,{WHITEN}",
           "-frames:v", "1", "-c:v", "libwebp", "-quality", "86", portrait)

    # OG image: full-body crop multiplied onto paper, 1200x630
    # (two steps: blending a seeked video against a lavfi colour source drops the video frame)
    with tempfile.TemporaryDirectory() as tmp:
        still = os.path.join(tmp, "og.png")
        ff("-ss", "0.2", "-i", args.src, "-vf",
           f"{crop},scale=-2:630:flags=lanczos,{WHITEN},pad=1200:630:(ow-iw)/2:0:white",
           "-frames:v", "1", still)
        ff("-i", still, "-f", "lavfi", "-i", f"color=c={PAPER}:s=1200x630:d=1", "-filter_complex",
           "[0:v]format=gbrp[p];[1:v]format=gbrp[bg];[bg][p]blend=all_mode=multiply,format=yuvj420p",
           "-frames:v", "1", "-q:v", "3", os.path.join(ROOT, "public", "og.jpg"))

    for f in ["hero/hero.mp4", "hero/hero.webm", "hero/hero-poster.webp", "portrait-bust.webp", "og.jpg"]:
        p = os.path.join(ROOT, "public", f)
        print(f"  {f:22s} {os.path.getsize(p) / 1024:8.1f} kB")


if __name__ == "__main__":
    main()
