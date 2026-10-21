"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  // the poster is the LCP candidate; fetch it before the video
  preload("/hero/hero-poster.webp", { as: "image", fetchPriority: "high" });
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const soundBtn = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // false once the visitor mutes on purpose, so we never re-unmute behind their back
  const wantsSound = useRef(true);
  const visible = useRef(true);

  useEffect(() => {
    const v = video.current;
    const s = section.current;
    if (!v || !s) return;
    const reduced = prefersReducedMotion();

    const sync = () => setSoundOn(!v.muted && !v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("volumechange", sync);

    // 1. try with sound, 2. fall back to muted autoplay
    const start = async () => {
      v.muted = false;
      try {
        await v.play();
        setBlocked(false);
      } catch {
        v.muted = true;
        setBlocked(true);
        v.play().catch(() => {});
      }
    };
    if (!reduced) start();
    else setBlocked(true);

    // first real interaction unlocks sound (the sound button handles its own click)
    const unlock = (e: Event) => {
      if (soundBtn.current?.contains(e.target as Node)) return;
      cleanupUnlock();
      if (!wantsSound.current || reduced) return;
      v.muted = false;
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const cleanupUnlock = () => evs.forEach((ev) => window.removeEventListener(ev, unlock, true));
    evs.forEach((ev) => window.addEventListener(ev, unlock, true));

    // pause (and silence) once less than 35 % of the hero is on screen
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (!reduced || !v.muted) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(s);

    return () => {
      io.disconnect();
      cleanupUnlock();
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("volumechange", sync);
    };
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    // read the element, not React state, so rapid clicks never act on a stale value
    if (!v.muted && !v.paused) {
      wantsSound.current = false;
      v.muted = true;
    } else {
      wantsSound.current = true;
      v.muted = false;
      setBlocked(false);
      v.play().catch(() => {});
    }
  };

  return (
    <section id="top" ref={section} className="hero" aria-labelledby="hero-title">
      <p className="hero-ghost" aria-hidden>
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="hero-stage">
        <video
          ref={video}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/hero-poster.webp"
          width={768}
          height={960}
          aria-label={`${PROFILE.name} giving a short spoken self-introduction`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="wrap hero-ui">
        <div className="hero-copy">
          <p className="tag rv">
            <b>{PROFILE.name}</b> — {PROFILE.title}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{PROFILE.name}, </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>Full-Stack &amp;</span>
            </span>
            <span className="rv-mask" style={{ "--i": 2 } as React.CSSProperties}>
              <span>
                AI/ML <span className="accent">Engineer.</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="hero-actions rv" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="hero-ctas">
            <a
              href="#work"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("work");
              }}
            >
              Explore work
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Resume ↓
            </a>
          </div>
          <button
            ref={soundBtn}
            type="button"
            className={`hero-sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute intro voice" : "Play intro with sound"}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <rect x="3" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
                <rect x="9.6" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <path d="M4.5 2.6v10.8a.6.6 0 0 0 .9.5l8.4-5.4a.6.6 0 0 0 0-1L5.4 2.1a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
@layer components {
.hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; overflow: clip; isolation: isolate; background: var(--paper); }
.hero-ghost { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); z-index: -1; margin: 0; font-weight: 800; letter-spacing: -.06em; line-height: .8; font-size: clamp(120px, 30vw, 520px); color: transparent; -webkit-text-stroke: 1px rgba(13,13,13,.12); white-space: nowrap; user-select: none; animation: ghost-in 1.6s var(--ease) both; }
@keyframes ghost-in { from { opacity: 0; transform: translate(-50%, -50%) scale(.96); } }
/* blend on the stage: its transform makes it an isolated group, so blending the <video> alone would have no backdrop */
.hero-stage { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); height: min(96svh, 1040px); aspect-ratio: 768 / 960; max-width: 100vw; mix-blend-mode: multiply; }
.hero-video { width: 100%; height: 100%; object-fit: contain; object-position: bottom; display: block; animation: video-in 1.4s var(--ease) both;
  /* soften the crop edges so the floor shadow fades instead of ending in a line */
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); }
@keyframes video-in { from { opacity: 0; transform: translateY(18px); } }
.hero-ui { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding-bottom: clamp(28px, 6vh, 64px); }
.hero-copy { max-width: min(32vw, 440px); }
.hero-title { margin: 18px 0 0; font-weight: 700; letter-spacing: -.045em; line-height: .98; font-size: clamp(40px, 5vw, 80px); }
.hero-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; max-width: 32vw; }
.hero-ctas { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
.hero-ctas .btn-ghost { background: rgba(244,242,238,.7); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.hero-ctas .btn-ghost:hover { background: var(--ink); }
.hero-sound { position: relative; width: 46px; height: 46px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; transition: transform .5s var(--ease); }
.hero-sound:hover { transform: scale(1.06); }
.hero-sound.is-blocked::after { content: ""; position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 1px var(--ink); animation: ping 2s var(--ease) infinite; }
@keyframes ping { 0% { transform: scale(1); opacity: .6; } 80%, 100% { transform: scale(1.7); opacity: 0; } }
@media (max-width: 860px) {
  .hero { flex-direction: column; align-items: stretch; justify-content: flex-end; padding-top: 76px; }
  .hero-stage { position: relative; left: auto; transform: none; height: 62svh; margin: 0 auto; }
  .hero-ghost { top: 34%; }
  .hero-ui { flex-direction: column; align-items: flex-start; padding-top: 8px; }
  .hero-copy, .hero-actions { max-width: none; }
  .hero-actions { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; }
  .hero-ctas { justify-content: flex-start; }
}
@media (max-width: 420px) { .hero-ctas .btn { height: 42px; padding: 0 16px; font-size: 14px; } }
}
`}</style>
    </section>
  );
}
