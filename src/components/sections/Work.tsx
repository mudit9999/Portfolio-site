"use client";

import { useState } from "react";
import { PROJECTS, SKILL_GROUPS, type Project } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

const LOGO_OF = Object.fromEntries(SKILL_GROUPS.flatMap((g) => g.skills.map((s) => [s.name, s.logo])));

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <SectionHead section="work" label="Selected work" title="Things I've" accent="built." id="work-title" />
          <p className="work-note rv">
            Professional engagements from the résumé. Hover, focus or tap a panel to open it.
          </p>
        </div>

        <div className="acc rv">
          {PROJECTS.map((p, i) => (
            <Panel key={p.id} p={p} open={open === i} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <style>{`
@layer components {
.work-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
.work-note { max-width: 34ch; margin: 0; color: var(--mute); font-size: 14px; line-height: 1.5; }
.acc { display: flex; gap: 10px; height: min(78svh, 600px); margin-top: 48px; }
.panel { position: relative; flex: 1 1 0; min-width: 0; border-radius: 26px; background: var(--card); box-shadow: var(--hair); overflow: hidden; transition: flex-grow .9s var(--ease), box-shadow .6s var(--ease); }
.panel.is-open { flex-grow: 8; box-shadow: var(--hair), var(--lift); }
.spine { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 22px 0; width: 100%; text-align: center; transition: opacity .4s var(--ease); border-radius: 26px; }
.panel.is-open .spine { opacity: 0; pointer-events: none; }
.spine-n { font-size: 12px; color: var(--mute); }
.spine-t { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 600; font-size: 15px; letter-spacing: -.01em; white-space: nowrap; max-height: 70%; overflow: hidden; text-overflow: ellipsis; }
.plus { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(13,13,13,.18); font-size: 18px; line-height: 1; transition: transform .6s var(--ease), background-color .4s, color .4s; }
.spine:hover .plus { transform: rotate(90deg); background: var(--ink); color: #fff; }
.pbody { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 28px; padding: 30px; min-width: 900px; opacity: 0; visibility: hidden; transition: opacity .5s var(--ease), visibility 0s .5s; }
.panel.is-open .pbody { opacity: 1; visibility: visible; transition: opacity .7s var(--ease) .25s, visibility 0s; }
.p-left { display: flex; flex-direction: column; min-height: 0; }
.p-kicker { display: flex; gap: 12px; font-size: 12px; color: var(--mute); text-transform: uppercase; letter-spacing: .05em; }
.p-kicker b { color: var(--ink); font-weight: 500; }
.p-title { margin: 14px 0 0; font-size: clamp(26px, 2.4vw, 36px); font-weight: 700; letter-spacing: -.04em; line-height: 1.02; }
.p-desc { margin: 14px 0 0; color: var(--ink-2); font-size: 14.5px; line-height: 1.55; }
.p-feats { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 13px; line-height: 1.35; }
.p-feats li { padding-left: 14px; position: relative; }
.p-feats li::before { content: ""; position: absolute; left: 0; top: .5em; width: 6px; height: 1px; background: var(--ink); }
.p-foot { margin-top: auto; padding-top: 18px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.p-foot .chip img, .p-foot .chip svg { flex: none; }
.p-right { position: relative; border-radius: 20px; background: var(--paper); overflow: hidden; clip-path: inset(0 100% 0 0 round 20px); transition: clip-path 1.1s var(--ease); }
.panel.is-open .p-right { clip-path: inset(0 0 0 0 round 20px); transition-delay: .3s; }
.ill-label { position: absolute; top: 12px; left: 14px; z-index: 2; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); background: rgba(255,255,255,.8); padding: 4px 8px; border-radius: 999px; }
@media (max-width: 1080px) {
  .acc { flex-direction: column; height: auto; }
  .panel { flex: none; }
  .spine { position: relative; flex-direction: row; padding: 18px 20px; gap: 16px; justify-content: flex-start; }
  .spine-t { writing-mode: horizontal-tb; transform: none; text-align: left; flex: 1; white-space: normal; max-height: none; }
  .panel.is-open .spine { display: none; }
  .pbody { position: relative; min-width: 0; display: none; grid-template-columns: 1fr; padding: 22px; }
  .panel.is-open .pbody { display: grid; }
  .p-right { height: 260px; }
}
@media (max-width: 560px) { .p-feats { grid-template-columns: 1fr; } }
.mini { position: absolute; inset: 0; padding: 44px 18px 18px; display: flex; flex-direction: column; gap: 10px; }
.m-card { background: #fff; border-radius: 14px; box-shadow: var(--hair); padding: 12px; }
.m-bar { height: 7px; border-radius: 4px; background: var(--soft); }
.m-bar.d { background: var(--ink); }
.m-bar.m { background: var(--faint); }
.m-row { display: flex; gap: 10px; align-items: center; }
.m-k { font-family: var(--font-mono); font-size: 10px; color: var(--mute); text-transform: uppercase; letter-spacing: .06em; }
.m-v { font-weight: 700; font-size: 22px; letter-spacing: -.04em; }
.m-bubble { max-width: 80%; border-radius: 14px; padding: 10px 12px; font-size: 12px; line-height: 1.4; }
.m-bubble.u { align-self: flex-end; background: var(--ink); color: #fff; border-bottom-right-radius: 4px; }
.m-bubble.a { background: #fff; box-shadow: var(--hair); border-bottom-left-radius: 4px; display: grid; gap: 6px; width: 78%; }
.m-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); animation: m-blink 1.4s infinite; }
@keyframes m-blink { 50% { opacity: .2; } }
.m-chart { display: flex; align-items: flex-end; gap: 8px; height: 100%; padding-top: 8px; }
.m-chart > div { flex: 1; display: flex; gap: 3px; align-items: flex-end; height: 100%; }
.m-chart i { flex: 1; border-radius: 4px 4px 2px 2px; background: var(--ink); transform-origin: bottom; animation: m-grow 1.2s var(--ease) both; }
.m-chart i + i { background: var(--faint); }
@keyframes m-grow { from { transform: scaleY(0); } }
.m-step { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.m-step b { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; box-shadow: inset 0 0 0 1px var(--line); background: #fff; font-weight: 600; }
.m-step.done b { background: var(--ink); color: #fff; }
.m-line { flex: 1; height: 1px; background: var(--line); }
.m-node { flex: none; padding: 9px 12px; border-radius: 12px; background: #fff; box-shadow: var(--hair); font-size: 12px; font-weight: 500; display: flex; gap: 6px; align-items: center; }
.m-node.d { background: var(--ink); color: #fff; }
}
`}</style>
    </section>
  );
}

function Panel({ p, open, onOpen }: { p: Project; open: boolean; onOpen: () => void }) {
  const bodyId = `project-${p.id}`;
  return (
    <article
      className={`panel ${open ? "is-open" : ""}`}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      aria-labelledby={`${bodyId}-t`}
    >
      <button type="button" className="spine" aria-expanded={open} aria-controls={bodyId} onClick={onOpen} tabIndex={open ? -1 : 0}>
        <span className="spine-n mono">{p.index}</span>
        <span className="spine-t">{p.title}</span>
        <span className="plus" aria-hidden>
          +
        </span>
      </button>

      <div id={bodyId} className="pbody" inert={!open}>
        <div className="p-left">
          <p className="p-kicker mono">
            <b>{p.index}</b>
            {p.kicker}
          </p>
          <h3 id={`${bodyId}-t`} className="p-title">
            {p.title}
          </h3>
          <p className="p-desc">{p.description}</p>
          <ul className="p-feats">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="p-foot">
            {p.tech.map((t) => (
              <span key={t} className="chip">
                <TechLogo name={LOGO_OF[t]} size={14} />
                {t}
              </span>
            ))}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary ml-auto">
                View on GitHub ↗
              </a>
            )}
          </div>
        </div>
        <div className="p-right">
          <span className="ill-label mono">Illustrative UI</span>
          <MiniUI id={p.id} />
        </div>
      </div>
    </article>
  );
}

/* ---------- illustrative, grayscale mini-UIs (not screenshots) ---------- */

function MiniUI({ id }: { id: string }) {
  const ui = UIS[id];
  return (
    <div className="mini" role="img" aria-label={`Illustrative UI: ${ui.alt}`}>
      {ui.node}
    </div>
  );
}

const Bars = ({ w }: { w: string[] }) => (
  <>
    {w.map((x, i) => (
      <div key={i} className={`m-bar ${i === 0 ? "d" : ""}`} style={{ width: x }} />
    ))}
  </>
);

const UIS: Record<string, { alt: string; node: React.ReactNode }> = {
  retail: {
    alt: "a retail KPI dashboard beside an AI assistant answering a store-level question",
    node: (
      <>
        <div className="m-row">
          {["Sales", "Traffic", "Conv."].map((k) => (
            <div key={k} className="m-card" style={{ flex: 1 }}>
              <div className="m-k">{k}</div>
              <div className="m-bar m" style={{ width: "70%", marginTop: 10 }} />
              <div className="m-bar" style={{ width: "40%", marginTop: 6 }} />
            </div>
          ))}
        </div>
        <div className="m-card" style={{ height: 64 }}>
          <svg viewBox="0 0 200 40" width="100%" height="100%" preserveAspectRatio="none" aria-hidden>
            <path d="M0 32 L25 26 L50 29 L75 18 L100 21 L125 12 L150 15 L175 6 L200 9" fill="none" stroke="#0d0d0d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
          <div className="m-bubble u">How did my district do this week?</div>
          <div className="m-bubble a">
            <Bars w={["85%", "95%", "60%"]} />
          </div>
          <div className="m-row m-k">
            <span className="m-dot" /> Assistant · follow-ups ready
          </div>
        </div>
      </>
    ),
  },
  procurement: {
    alt: "a forecast versus actual supply bar chart above a plant table",
    node: (
      <>
        <div className="m-row m-k" style={{ justifyContent: "space-between" }}>
          <span>Forecast vs actual</span>
          <span>■ plan ▪ supplied</span>
        </div>
        <div className="m-card" style={{ flex: 1 }}>
          <div className="m-chart">
            {[
              [62, 55],
              [74, 70],
              [58, 61],
              [86, 79],
              [70, 72],
              [92, 88],
            ].map(([a, b], i) => (
              <div key={i}>
                <i style={{ height: `${a}%`, animationDelay: `${i * 60}ms` }} />
                <i style={{ height: `${b}%`, animationDelay: `${i * 60 + 30}ms` }} />
              </div>
            ))}
          </div>
        </div>
        {["US", "CA", "US"].map((c, i) => (
          <div key={i} className="m-card m-row" style={{ padding: "9px 12px" }}>
            <span className="m-k" style={{ width: 24 }}>{c}</span>
            <div className="m-bar m" style={{ flex: 2 }} />
            <div className="m-bar" style={{ flex: 1 }} />
            <div className="m-bar d" style={{ width: 28 }} />
          </div>
        ))}
      </>
    ),
  },
  "shared-services": {
    alt: "a shared-services request form with a multi-stage approval tracker",
    node: (
      <>
        <div className="m-card" style={{ display: "grid", gap: 10 }}>
          <div className="m-k">New request</div>
          {["Location", "Request type", "Budget"].map((l) => (
            <div key={l} style={{ display: "grid", gap: 5 }}>
              <span style={{ fontSize: 11, color: "var(--mute)" }}>{l}</span>
              <div style={{ height: 26, borderRadius: 8, boxShadow: "var(--hair)", background: "var(--paper)" }} />
            </div>
          ))}
        </div>
        <div className="m-card" style={{ display: "grid", gap: 12, marginTop: "auto" }}>
          <div className="m-k">Approvals</div>
          <div className="m-row">
            {["Raised", "Manager", "Finance"].map((s, i) => (
              <div key={s} className={`m-step ${i < 2 ? "done" : ""}`} style={{ flex: i < 2 ? 1 : "none" }}>
                <b>{i < 2 ? "✓" : i + 1}</b>
                {s}
                {i < 2 && <span className="m-line" />}
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  automation: {
    alt: "a reusable workflow pipeline deploying to several client environments",
    node: (
      <>
        <div className="m-k">Workflow package</div>
        <div className="m-row" style={{ flexWrap: "wrap" }}>
          <span className="m-node d">Trigger</span>
          <span className="m-line" />
          <span className="m-node">Validate</span>
          <span className="m-line" />
          <span className="m-node">Run</span>
        </div>
        <div className="m-k" style={{ marginTop: 8 }}>Deployed to</div>
        {["Client A", "Client B", "Client C"].map((c) => (
          <div key={c} className="m-card m-row" style={{ padding: "10px 12px" }}>
            <span style={{ fontSize: 12, fontWeight: 600, width: 64 }}>{c}</span>
            <div className="m-bar m" style={{ flex: 1 }} />
            <span className="m-step done">
              <b>✓</b>
            </span>
          </div>
        ))}
        <div className="m-card" style={{ marginTop: "auto", display: "grid", gap: 6 }}>
          <div className="m-k">Risk register</div>
          <Bars w={["70%", "90%", "50%"]} />
        </div>
      </>
    ),
  },
};
