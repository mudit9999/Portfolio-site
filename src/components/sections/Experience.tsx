"use client";

import { useCallback, useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "../ui/SectionHead";

// chronological: education first, then work (both arrays are already in order)
const STOPS = [...EDUCATION, ...EXPERIENCE];

export default function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    const ol = list.current;
    if (!ol || !fill.current) return;
    fill.current.style.transform = `scaleY(${p})`;
    const reach = p * ol.offsetHeight;
    ol.querySelectorAll<HTMLElement>(".stop").forEach((s) => s.classList.toggle("is-lit", s.offsetTop + 14 <= reach));
  }, []);
  useScrollProgress(list, onProgress, { start: 0.7, end: 0.55 });

  return (
    <section id="experience" className="section exp" aria-labelledby="exp-title">
      <div className="wrap">
        <SectionHead section="experience" label="Education & experience" title="The path so" accent="far." id="exp-title" />

        <div className="path">
          <span className="rail-line" aria-hidden>
            <span ref={fill} className="spine-fill" />
          </span>
          <ol ref={list}>
            {STOPS.map((s) => (
              <li key={s.title} className="stop">
                <span className="dot" aria-hidden />
                <p className="s-year mono">{s.year}</p>
                <div className="s-body">
                  <p className="s-kind mono">{s.kind === "education" ? "Education" : "Experience"}</p>
                  <h3 className="s-title">{s.title}</h3>
                  <p className="s-place">{s.place}</p>
                  <p className="s-detail">{s.detail}</p>
                </div>
              </li>
            ))}
            <li className="stop stop-next">
              <span className="dot" aria-hidden />
              <p className="s-year mono">Next</p>
              <a
                href="#contact"
                className="next-card"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("contact");
                }}
              >
                <span className="s-title">
                  Next — Your <span className="accent">team?</span>
                </span>
                <span className="next-go" aria-hidden>
                  →
                </span>
              </a>
            </li>
          </ol>
        </div>
      </div>

      <style>{`
@layer components {
.path { position: relative; margin-top: 64px; --year: 180px; --rail: 40px; }
.path ol { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(48px, 9vh, 96px); }
.path .rail-line { position: absolute; top: 8px; bottom: 8px; left: calc(var(--year) + var(--rail) / 2); width: 1px; background: var(--line); }
.spine-fill { position: absolute; inset: 0; background: var(--ink); transform: scaleY(0); transform-origin: 0 0; }
.stop { position: relative; display: grid; grid-template-columns: var(--year) var(--rail) minmax(0, 1fr); align-items: start; }
.stop .dot { position: absolute; left: calc(var(--year) + var(--rail) / 2 - 7px); top: 6px; width: 15px; height: 15px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 1px var(--faint); transition: background-color .6s var(--ease), box-shadow .6s var(--ease), transform .6s var(--ease); }
.stop.is-lit .dot { background: var(--ink); box-shadow: inset 0 0 0 1px var(--ink), 0 0 0 6px rgba(13,13,13,.06); transform: scale(1.1); }
.s-year { grid-column: 1; margin: 2px 0 0; font-size: 13px; color: var(--mute); transition: color .6s var(--ease); }
/* unlit stops stay legible (AA contrast); lighting up = ink title + filled dot + settle */
.s-body, .next-card { grid-column: 3; transform: translateX(10px); transition: transform .8s var(--ease); }
.s-body .s-title, .s-body .s-place, .next-card .s-title { color: var(--mute); transition: color .8s var(--ease); }
.stop.is-lit .s-body .s-title, .stop.is-lit .next-card .s-title { color: var(--ink); }
.stop.is-lit .s-body .s-place { color: var(--ink-2); }
.stop.is-lit .s-year { color: var(--ink); }
.stop.is-lit .s-body, .stop.is-lit .next-card { transform: none; }
.s-kind { margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--mute); }
.s-title { display: block; margin: 8px 0 0; font-size: clamp(24px, 2.6vw, 38px); font-weight: 700; letter-spacing: -.04em; line-height: 1.05; }
.s-place { margin: 8px 0 0; font-size: 16px; font-weight: 500; color: var(--ink-2); }
.s-detail { margin: 12px 0 0; max-width: 62ch; font-size: 15px; line-height: 1.6; color: var(--mute); }
.next-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 26px 28px; border-radius: 26px; border: 1.5px dashed rgba(13,13,13,.25); transition: transform .8s var(--ease), background-color .5s var(--ease), border-color .5s; }
.next-card .s-title { margin: 0; }
.next-card:hover { background: var(--card); border-color: var(--ink); }
.next-go { width: 46px; height: 46px; flex: none; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 18px; transition: transform .5s var(--ease); }
.next-card:hover .next-go { transform: translateX(4px); }
@media (max-width: 720px) {
  .path { --year: 0px; --rail: 32px; }
  .stop { grid-template-columns: var(--rail) minmax(0,1fr); }
  .stop .dot { left: calc(var(--rail) / 2 - 7px); }
  .s-year { grid-column: 2; grid-row: 1; margin-bottom: 8px; }
  .s-body, .next-card { grid-column: 2; }
  .next-card { padding: 20px; }
}
}
`}</style>
    </section>
  );
}
