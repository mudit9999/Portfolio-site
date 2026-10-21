"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE, PROFILE, SECTION_INDEX } from "@/lib/data";
import IdCard from "../ui/IdCard";

const current = EXPERIENCE[EXPERIENCE.length - 1];

const FACTS = [
  { k: "Education", v: `B.Tech IT, AKGEC · ${EDUCATION[0].year.slice(-4)}` },
  { k: "Current role", v: `${current.title}, ${current.place}` },
  { k: "Languages", v: "English & Hindi" },
  { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
];

export default function About() {
  const section = useRef<HTMLElement>(null);
  return (
    <section id="about" ref={section} className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="about-left">
          <div>
            <p className="tag rv">
              <b>{SECTION_INDEX.about}</b> — About
            </p>
            <h2 id="about-title" className="h-display mt-5">
              <span className="rv-mask">
                <span>
                  Hi, I&apos;m <span className="accent">{PROFILE.firstName}.</span>
                </span>
              </span>
            </h2>
            <p className="about-summary rv" style={{ "--i": 1 } as React.CSSProperties}>
              {PROFILE.resumeSummary}
            </p>
            <p className="about-extra rv" style={{ "--i": 2 } as React.CSSProperties}>
              {PROFILE.currently}
            </p>
          </div>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} download className="btn btn-primary">
              Resume ↓
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub ↗
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn ↗
            </a>
          </div>
        </div>

        <div className="about-card">
          <IdCard area={section} />
        </div>

        <div className="about-right">
          <div>
            <p className="tag rv">Quick facts</p>
            <dl className="facts">
              {FACTS.map((f, i) => (
                <div key={f.k} className="rv" style={{ "--i": i + 1 } as React.CSSProperties}>
                  <dt className="mono">{f.k}</dt>
                  <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <blockquote className="about-quote rv" style={{ "--i": 5 } as React.CSSProperties}>
            <span className="accent">“</span>
            {PROFILE.quote}
          </blockquote>
        </div>
      </div>

      <style>{`
@layer components {
.about-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px minmax(0,1fr); gap: clamp(24px, 4vw, 64px); align-items: stretch; }
.about-left, .about-right { display: flex; flex-direction: column; justify-content: space-between; gap: 40px; }
.about-card { display: flex; justify-content: center; margin-top: calc(-1 * var(--section-y)); }
.about-summary { margin: 28px 0 0; font-size: clamp(16px, 1.25vw, 18px); line-height: 1.6; color: var(--ink-2); max-width: 46ch; }
.about-extra { margin: 14px 0 0; color: var(--mute); font-size: 15px; }
.about-btns { display: flex; flex-wrap: wrap; gap: 10px; }
.about-right { padding-top: 6px; }
.facts { margin: 18px 0 0; }
.facts div { display: grid; grid-template-columns: 110px minmax(0,1fr); gap: 16px; padding: 16px 0; border-top: 1px solid var(--line); }
.facts div:last-child { border-bottom: 1px solid var(--line); }
.facts dt { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--mute); padding-top: 3px; }
.facts dd { margin: 0; font-size: 15px; font-weight: 500; overflow-wrap: anywhere; }
.facts a { text-decoration: underline; text-decoration-color: var(--faint); text-underline-offset: 3px; transition: text-decoration-color .3s; }
.facts a:hover { text-decoration-color: var(--ink); }
.about-quote { margin: 0; font-size: clamp(22px, 2vw, 30px); line-height: 1.2; letter-spacing: -.03em; font-weight: 600; max-width: 22ch; }
.about-quote .accent { font-size: 1.6em; line-height: 0; vertical-align: -.3em; margin-right: 4px; }
@media (max-width: 1080px) {
  .about-grid { grid-template-columns: 1fr; gap: 56px; }
  .about-card { margin-top: 0; order: 2; }
  .about-right { order: 3; }
}
}
`}</style>
    </section>
  );
}
