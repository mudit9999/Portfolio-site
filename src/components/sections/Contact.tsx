"use client";

import { useState } from "react";
import { PROFILE, SECTION_INDEX } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const LINES = ["Let's build", "something together."];

/** Each letter hops once when the pointer passes over it. */
function Hop({ text, accentFrom = Infinity }: { text: string; accentFrom?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={`hop ${i >= accentFrom ? "accent" : ""}`}
          onPointerEnter={(e) => {
            const el = e.currentTarget;
            el.classList.remove("is-hop");
            void el.offsetWidth; // restart the animation
            el.classList.add("is-hop");
          }}
          onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hop")}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="tag rv">
          <b>{SECTION_INDEX.contact}</b> — Contact
        </p>
        <h2 id="contact-title" className="contact-title">
          <span className="sr-only">{LINES.join(" ")}</span>
          <span aria-hidden>
            <span className="rv-mask">
              <span>
                <Hop text={LINES[0]} />
              </span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <Hop text={LINES[1]} accentFrom={LINES[1].indexOf("together")} />
              </span>
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <div className="contact-main rv">
            <div className="mail-row">
              <a href={`mailto:${PROFILE.email}`} className="mail">
                {PROFILE.email}
              </a>
              <button type="button" className="chip copy" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <ul className="contact-links">
              <li>
                <span className="mono">Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              <li>
                <span className="mono">GitHub</span>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                  github.com/{PROFILE.githubHandle} ↗
                </a>
              </li>
              <li>
                <span className="mono">LinkedIn</span>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  in/{PROFILE.linkedinHandle} ↗
                </a>
              </li>
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="badge rv" aria-label={`Say hello by email to ${PROFILE.name}`}>
            <svg viewBox="0 0 200 200" aria-hidden>
              <defs>
                <path id="badge-c" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
              </defs>
              <text>
                <textPath href="#badge-c" textLength="460">
                  SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span className="badge-c" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>

      <footer className="wrap foot">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("top");
          }}
        >
          Back to top ↑
        </a>
        <p className="mono">Built with Next.js</p>
      </footer>

      <style>{`
@layer components {
.contact { padding-bottom: 0; }
.contact-title { margin: 22px 0 0; font-weight: 700; letter-spacing: -.05em; line-height: .95; font-size: clamp(44px, 9.4vw, 150px); }
.hop { display: inline-block; }
.hop.is-hop { animation: hop .6s var(--ease); }
@keyframes hop { 0% { transform: none; } 35% { transform: translateY(-.14em); } 65% { transform: translateY(.02em); } 100% { transform: none; } }
.contact-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-top: clamp(48px, 8vh, 88px); flex-wrap: wrap; }
.mail-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.mail { font-size: clamp(22px, 3.4vw, 48px); font-weight: 600; letter-spacing: -.04em; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: .18em; text-decoration-color: var(--faint); transition: text-decoration-color .4s var(--ease); overflow-wrap: anywhere; }
.mail:hover { text-decoration-color: var(--ink); }
.copy { cursor: pointer; transition: background-color .4s var(--ease), color .4s var(--ease); }
.copy:hover { background: var(--ink); color: #fff; }
.contact-links { list-style: none; margin: 32px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 14px 40px; }
.contact-links li { display: grid; gap: 4px; }
.contact-links .mono { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--mute); }
.contact-links a { font-size: 16px; font-weight: 500; }
.contact-links a:hover { text-decoration: underline; text-underline-offset: 3px; }
.badge { position: relative; width: 156px; height: 156px; flex: none; display: grid; place-items: center; border-radius: 50%; }
.badge svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: spin 16s linear infinite; }
.badge text { font-family: var(--font-mono); font-size: 15px; letter-spacing: .12em; fill: var(--ink); }
.badge-c { width: 62px; height: 62px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-size: 22px; transition: transform .6s var(--ease); }
.badge:hover .badge-c { transform: rotate(45deg) scale(1.08); }
@keyframes spin { to { transform: rotate(360deg); } }
.foot { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: clamp(80px, 14vh, 140px); padding-block: 28px; border-top: 1px solid var(--line); font-size: 13px; color: var(--mute); }
.foot p { margin: 0; }
.foot a { color: var(--ink); font-weight: 500; }
.foot a:hover { text-decoration: underline; text-underline-offset: 3px; }
}
`}</style>
    </section>
  );
}
