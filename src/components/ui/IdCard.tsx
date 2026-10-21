"use client";

/* eslint-disable @next/next/no-img-element -- tiny local webp */
import { useEffect, useRef, useState } from "react";
import { EDUCATION, PROFILE } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";

const STRAP = `${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `;
const GRAD_YEAR = EDUCATION[0].year.slice(-4);

// deterministic decorative barcode from the GitHub handle
const BARS = Array.from(`${PROFILE.githubHandle}${PROFILE.initials}`).flatMap((c) => {
  const n = c.charCodeAt(0);
  return [1 + (n % 3), 1 + ((n >> 2) % 2), 1 + ((n >> 3) % 3)];
});

const BACK_LINES = [
  `${PROFILE.role} — 5+ years`,
  "B.Tech in Information Technology, AKGEC (A.K.T.U.)",
  "TCS CodeVita Season 8 — Global Rank 4520",
  "Insights Assist & a LangGraph multi-agent chatbot",
  "Smart India Hackathon 2018 — National Finalist",
];

/** ID card on a lanyard: damped pendulum swing, idle sway, 3D flip. */
export default function IdCard({ area }: { area: React.RefObject<HTMLElement | null> }) {
  const hanger = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const inView = useInView(hanger, { rootMargin: "100px" });

  useEffect(() => {
    const el = hanger.current;
    const zone = area.current;
    if (!el || !zone || !inView || prefersReducedMotion()) return;
    let angle = 0;
    let vel = 0;
    let last = performance.now();
    let lastMove = 0;
    let px: number | null = null;
    let pt = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (px !== null && now - pt < 100) {
        const vx = (e.clientX - px) / Math.max(8, now - pt); // px per ms
        vel += Math.max(-60, Math.min(60, vx * 9));
      }
      px = e.clientX;
      pt = now;
      lastMove = now;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const idle = now - lastMove > 1500;
      const target = idle ? Math.sin(now / 1100) * 1.6 : 0;
      const acc = -38 * (angle - target) - 3.4 * vel; // spring + damping
      vel += acc * dt;
      angle = Math.max(-24, Math.min(24, angle + vel * dt));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    zone.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      zone.removeEventListener("pointermove", onMove);
    };
  }, [inView, area]);

  return (
    <div className="lanyard" ref={hanger}>
      <div className="strap" aria-hidden>
        <div className="strap-text mono">
          <span>{STRAP.repeat(3)}</span>
          <span>{STRAP.repeat(3)}</span>
        </div>
      </div>
      <div className="clip" aria-hidden>
        <span />
      </div>

      <div
        className={`idcard ${flipped ? "is-flipped" : ""}`}
        role="group"
        aria-roledescription="ID card"
        tabIndex={0}
        aria-label={`Developer ID card. Press Enter to show the ${flipped ? "front" : "back"}.`}
        onPointerUp={(e) => e.pointerType !== "mouse" && setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        <div className="idcard-inner">
          <div className="idcard-face idcard-front">
            <div className="idcard-band">
              <span className="slot" />
              <span className="mono">DEVELOPER ID</span>
              <span className="mono">{PROFILE.initials}</span>
            </div>
            <div className="idcard-photo">
              <div className="ring">
                <img src="/portrait-bust.webp" width={128} height={156} alt={`Portrait of ${PROFILE.name}`} />
              </div>
            </div>
            <p className="idcard-name">{PROFILE.name}</p>
            <p className="idcard-role">{PROFILE.role}</p>
            <dl className="idcard-rows mono">
              <div>
                <dt>ID No.</dt>
                <dd>@{PROFILE.githubHandle}</dd>
              </div>
              <div>
                <dt>Dept.</dt>
                <dd>AI / ML &amp; GenAI</dd>
              </div>
              <div>
                <dt>Valid till</dt>
                <dd>Unknown</dd>
              </div>
            </dl>
            <div className="idcard-foot" aria-hidden>
              <div className="barcode">
                {BARS.map((w, i) => (
                  <i key={i} style={{ width: w, opacity: i % 2 ? 0 : 1 }} />
                ))}
              </div>
              <span className="holo" />
            </div>
          </div>

          <div className="idcard-face idcard-back">
            <div className="idcard-band">
              <span className="slot" />
              <span className="mono">WHAT I AM</span>
              <span className="mono">↺</span>
            </div>
            <ol className="back-list">
              {BACK_LINES.map((l, i) => (
                <li key={l}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {l}
                </li>
              ))}
            </ol>
            <div className="sign">
              <span className="accent">{PROFILE.name}</span>
              <small className="mono">Signature</small>
            </div>
            <p className="found mono">
              If found, say hello · <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
@layer components {
.lanyard { position: relative; display: flex; flex-direction: column; align-items: center; transform-origin: 50% 0; will-change: transform; }
.strap { width: 30px; height: calc(var(--section-y) + 56px); background: #1b1b1b; border-radius: 0 0 4px 4px; overflow: hidden; box-shadow: inset 1px 0 0 rgba(255,255,255,.08), inset -1px 0 0 rgba(255,255,255,.08); }
.strap-text { display: flex; flex-direction: column; align-items: center; font-size: 9px; letter-spacing: .18em; color: rgba(255,255,255,.62); animation: strap 18s linear infinite; white-space: nowrap; }
.strap-text span { writing-mode: vertical-rl; }
@keyframes strap { to { transform: translateY(-50%); } }
.clip { width: 26px; height: 30px; margin-top: -4px; border-radius: 6px 6px 10px 10px; background: linear-gradient(90deg, #8d8d8d, #e8e8e8 40%, #9b9b9b 70%, #d6d6d6); box-shadow: 0 2px 4px rgba(0,0,0,.2); position: relative; z-index: 2; }
.clip span { position: absolute; left: 50%; bottom: -10px; width: 14px; height: 16px; transform: translateX(-50%); border: 3px solid #a8a8a8; border-top: 0; border-radius: 0 0 8px 8px; }
.idcard { width: 300px; height: 404px; margin-top: 2px; perspective: 1400px; cursor: pointer; border-radius: 22px; outline-offset: 6px; touch-action: manipulation; }
.idcard-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 1s var(--ease); }
.idcard.is-flipped .idcard-inner { transform: rotateY(180deg); }
@media (hover: hover) { .idcard:hover .idcard-inner { transform: rotateY(180deg); } }
.idcard-face { position: absolute; inset: 0; border-radius: 22px; background: #fff; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; box-shadow: var(--hair), 0 40px 70px -35px rgba(13,13,13,.4), 0 10px 20px -12px rgba(13,13,13,.15); display: flex; flex-direction: column; align-items: center; }
.idcard-back { transform: rotateY(180deg); align-items: stretch; }
/* Safari ignores backface-visibility for composited children (the photo leaked through the back),
   so also hide the turned-away face; the swap lands at ~0.1s, when the eased flip passes 90deg */
.idcard-face { transition: visibility 0s .1s; }
.idcard-back, .idcard.is-flipped .idcard-front { visibility: hidden; }
.idcard.is-flipped .idcard-back { visibility: visible; }
@media (hover: hover) { .idcard:hover .idcard-front { visibility: hidden; } .idcard:hover .idcard-back { visibility: visible; } }
.idcard-band { width: 100%; height: 48px; background: var(--ink); color: #fff; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 18px 10px; font-size: 10px; letter-spacing: .2em; position: relative; flex: none; }
.idcard-band .slot { position: absolute; left: 50%; top: 8px; width: 44px; height: 8px; border-radius: 6px; transform: translateX(-50%); background: var(--paper); box-shadow: inset 0 1px 2px rgba(0,0,0,.4); }
.idcard-photo { margin-top: 14px; position: relative; }
.idcard-photo::before { content: ""; position: absolute; inset: -18px; border-radius: 40%; background: radial-gradient(closest-side, rgba(13,13,13,.12), transparent); z-index: 0; }
.ring { position: relative; z-index: 1; padding: 3px; border-radius: 18px; background: linear-gradient(150deg, #d9d6d0, #6b6966 45%, #e7e4de 70%, #8e8b86); }
.ring img { display: block; width: 128px; height: 156px; object-fit: cover; border-radius: 15px; background: #fff; transition: transform .8s var(--ease); }
.ring { overflow: hidden; }
.idcard:hover .ring img { transform: scale(1.06); }
.idcard-name { margin: 10px 0 0; font-weight: 700; font-size: 19px; letter-spacing: -.03em; }
.idcard-role { margin: 2px 0 0; font-size: 12px; color: var(--mute); }
.idcard-rows { width: 100%; padding: 0 22px; margin: 8px 0 0; font-size: 10.5px; }
.idcard-rows div { display: flex; justify-content: space-between; padding: 3px 0; border-top: 1px dashed var(--line); }
.idcard-rows dt { color: var(--mute); text-transform: uppercase; letter-spacing: .1em; }
.idcard-rows dd { margin: 0; color: var(--ink); }
.idcard-foot { margin-top: auto; width: 100%; padding: 8px 22px 14px; display: flex; align-items: center; justify-content: space-between; }
.barcode { display: flex; height: 24px; gap: 0; }
.barcode i { display: block; height: 100%; background: var(--ink); margin-right: 1px; }
.holo { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(from 0deg, #f2f2f2, #9a9a9a, #e0e0e0, #6f6f6f, #f5f5f5, #b3b3b3, #f2f2f2); box-shadow: inset 0 0 0 1px rgba(13,13,13,.12); animation: holo 8s linear infinite; }
@keyframes holo { to { transform: rotate(360deg); } }
.back-list { list-style: none; margin: 0; padding: 16px 22px 0; display: grid; gap: 8px; font-size: 12.5px; line-height: 1.35; color: var(--ink-2); }
.back-list li { display: grid; grid-template-columns: 22px 1fr; gap: 6px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.back-list li span { font-size: 10px; color: var(--mute); padding-top: 2px; }
.sign { margin: auto 22px 0; display: flex; flex-direction: column; gap: 4px; }
.sign .accent { border-bottom: 1px solid var(--ink); padding-bottom: 4px; }
.sign .accent { font-size: 26px; color: var(--ink); line-height: 1; }
.sign small { font-size: 9px; color: var(--mute); letter-spacing: .12em; text-transform: uppercase; }
.found { margin: 10px 22px 14px; font-size: 9.5px; color: var(--mute); line-height: 1.5; }
.found a { display: block; padding: 5px 0; margin-top: -3px; }
.found a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }
@media (max-width: 1080px) { .strap { height: 120px; } }
}
`}</style>
    </div>
  );
}
