"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { isBrand, tintOf } from "../ui/TechLogo";

const fmt = (a: Achievement, v: number) => `${a.prefix ?? ""}${a.static ? v : v.toLocaleString("en-US")}${a.suffix ?? ""}`;
const total = String(ACHIEVEMENTS.length).padStart(2, "0");

/** 0 → value over 1.4 s, easeOutQuart. */
function countUp(el: HTMLElement, a: Achievement) {
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / 1400);
    el.textContent = fmt(a, Math.round(a.value * (1 - Math.pow(1 - t, 4))));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function Achievements() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // pinned horizontal travel
  useEffect(() => {
    const sec = section.current!;
    const tr = track.current!;
    const cards = Array.from(tr.querySelectorAll<HTMLElement>(".ach"));
    let travel = 0;
    let raf = 0;
    const reduced = prefersReducedMotion();
    const counted = ACHIEVEMENTS.map((a) => a.static || reduced);
    cards.forEach((c, i) => {
      if (!counted[i]) c.querySelector(".ach-num")!.textContent = fmt(ACHIEVEMENTS[i], 0);
    });

    const measure = () => {
      travel = Math.max(0, tr.scrollWidth - pin.current!.clientWidth);
      sec.style.height = `calc(100svh + ${travel}px)`;
      update();
    };
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const x = p * travel;
      tr.style.transform = `translate3d(${-x}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const mid = window.innerWidth / 2;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const c of cards) {
        const d = Math.abs(c.offsetLeft - x + c.offsetWidth / 2 - mid);
        if (d < bestD) [best, bestD] = [c, d];
      }
      cards.forEach((c, i) => {
        c.classList.toggle("is-center", c === best);
        // count up once a card has entered the pinned view (or been scrolled past)
        if (!counted[i] && r.top < window.innerHeight * 0.5 && c.offsetLeft - x < window.innerWidth * 0.85) {
          counted[i] = true;
          countUp(c.querySelector<HTMLElement>(".ach-num")!, ACHIEVEMENTS[i]);
        }
      });
    };
    const req = () => (raf ||= requestAnimationFrame(update));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="achievements" ref={section} className="achs" aria-labelledby="ach-title">
      <div ref={pin} className="ach-pin">
        <div className="wrap ach-head">
          <SectionHead section="achievements" label="Achievements" title="Numbers I'm proud" accent="of." id="ach-title" />
          <div className="ach-progress" aria-hidden>
            <span ref={bar} />
          </div>
        </div>

        <div ref={track} className="ach-track">
          {ACHIEVEMENTS.map((a, i) => (
            <article key={a.label} className="ach" aria-label={`${a.label}: ${fmt(a, a.value)}. ${a.caption}. ${a.detail}`}>
              <div className="ach-top">
                <span
                  className={`ach-logo ${isBrand(a.logo) ? "is-brand" : ""}`}
                  style={{ "--tint": tintOf(a.logo) } as React.CSSProperties}
                >
                  <TechLogo name={a.logo} size={34} />
                </span>
                <span className="ach-idx mono">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="ach-bottom">
                <div className="ach-text">
                  <h3>{a.label}</h3>
                  <p className="ach-cap">{a.caption}</p>
                  <p className="ach-det mono">{a.detail}</p>
                </div>
                <p className="ach-num" aria-hidden>
                  {fmt(a, a.value)}
                </p>
              </div>
            </article>
          ))}
          <p className="ach-end" aria-hidden>
            and <span className="accent">counting</span> →
          </p>
        </div>
      </div>

      <style>{`
@layer components {
.achs { position: relative; height: 200svh; }
.ach-pin { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: clamp(28px, 6vh, 56px); }
.ach-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.ach-progress { width: min(220px, 30vw); height: 2px; background: var(--line); border-radius: 2px; overflow: hidden; flex: none; margin-bottom: 14px; }
.ach-progress span { display: block; height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: 0 50%; }
.ach-track { display: flex; gap: 20px; align-items: center; width: max-content; padding: 24px var(--gutter) 40px max(var(--gutter), calc((100vw - 1320px) / 2)); will-change: transform; }
.ach { flex: none; width: clamp(340px, 40vw, 540px); height: clamp(260px, 36vh, 310px); max-width: calc(100vw - 2 * var(--gutter)); background: var(--card); border-radius: 28px; box-shadow: var(--hair), 0 10px 30px -24px rgba(13,13,13,.25); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: transform .8s var(--ease), box-shadow .8s var(--ease); }
.ach.is-center { transform: translateY(-12px); box-shadow: var(--hair), 0 40px 70px -30px rgba(13,13,13,.3), 0 12px 24px -14px rgba(13,13,13,.12); }
.ach-top { display: flex; justify-content: space-between; align-items: flex-start; }
.ach-logo { position: relative; width: 72px; height: 72px; border-radius: 20px; display: grid; place-items: center; background: #fff; box-shadow: var(--hair); color: var(--ink); }
.ach-logo::before { content: ""; position: absolute; inset: -14px; border-radius: 50%; z-index: -1; background: radial-gradient(closest-side, color-mix(in srgb, var(--tint) 30%, transparent), transparent); opacity: .5; transition: opacity .8s var(--ease), transform .8s var(--ease); }
.ach { isolation: isolate; }
.ach.is-center .ach-logo::before { opacity: 1; transform: scale(1.15); }
.ach-idx { font-size: 12px; color: var(--mute); }
.ach-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.ach-text { min-width: 0; }
.ach-text h3 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.02em; }
.ach-cap { margin: 4px 0 0; font-size: 14px; color: var(--ink-2); }
.ach-det { margin: 10px 0 0; font-size: 11px; color: var(--mute); line-height: 1.4; }
.ach-num { margin: 0; font-weight: 700; letter-spacing: -.06em; line-height: .85; font-size: clamp(56px, 7vw, 104px); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ach-end { flex: none; margin: 0 0 0 20px; font-size: clamp(28px, 3vw, 44px); font-weight: 700; letter-spacing: -.04em; white-space: nowrap; }
@media (max-width: 560px) {
  .ach { padding: 20px; }
  .ach-bottom { flex-direction: column-reverse; align-items: flex-start; gap: 10px; }
  .ach-num { font-size: 60px; }
  .ach-progress { display: none; }
}
}
`}</style>
    </section>
  );
}
