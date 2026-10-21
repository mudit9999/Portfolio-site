"use client";

import { useRef, useState } from "react";
import { PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { isBrand, tintOf } from "../ui/TechLogo";

const TILES = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family }))).map((s, i) => ({
  ...s,
  n: i + 1,
  d8: Math.floor(i / 8) + (i % 8),
  d4: Math.floor(i / 4) + (i % 4),
}));
const FAMILIES = SKILL_GROUPS.map((g) => g.family);
const projectTitle = (id: string) => PROJECTS.find((p) => p.id === id)?.title ?? id;

export default function Skills() {
  const grid = useRef<HTMLUListElement>(null);
  const shown = useInView(grid, { once: true, threshold: 0.15 });
  const [filter, setFilter] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const t = TILES[active];

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead
          section="skills"
          label="Skills"
          title="The periodic table of my"
          accent="stack."
          id="skills-title"
        />

        <div className="chips rv" role="group" aria-label="Filter skills by family">
          {[null, ...FAMILIES].map((f) => (
            <button
              key={f ?? "all"}
              type="button"
              className={`fchip ${filter === f ? "is-on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f ?? "All"}
            </button>
          ))}
        </div>

        <div className="ptable">
          <ul ref={grid} className={`pgrid ${shown ? "is-shown" : ""}`}>
            {TILES.map((s, i) => {
              const dim = filter !== null && s.family !== filter;
              return (
                <li
                  key={s.name}
                  style={{ "--d8": s.d8, "--d4": s.d4 } as React.CSSProperties}
                  className={`ptile ${dim ? "is-dim" : ""} ${active === i ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-label={`${s.name}, ${s.family}`}
                  >
                    <span className="pt-n mono">{s.n}</span>
                    <span className="pt-sym">{s.symbol}</span>
                    <span className="pt-name">{s.name}</span>
                    <span className="pt-fam mono">{s.family}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="inspector card" aria-live="polite" aria-label="Skill details">
            <div className="insp-top mono">
              <span>No. {String(t.n).padStart(2, "0")}</span>
              <span>{t.symbol}</span>
            </div>
            <div className="insp-logo" key={t.name} style={{ "--tint": tintOf(t.logo) } as React.CSSProperties}>
              <TechLogo name={t.logo} size={150} label={isBrand(t.logo) ? `${t.name} logo` : `${t.name} icon`} />
            </div>
            <h3 className="insp-name">{t.name}</h3>
            <p className="insp-fam mono">{t.family}</p>
            <div className="insp-used">
              <p className="mono">Used in</p>
              {t.projects.length ? (
                <ul>
                  {t.projects.map((id) => (
                    <li key={id}>{projectTitle(id)}</li>
                  ))}
                </ul>
              ) : (
                <p className="insp-none">Listed under Technical Skills in the résumé.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
@layer components {
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
.fchip { height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; box-shadow: inset 0 0 0 1px rgba(13,13,13,.14); transition: background-color .4s var(--ease), color .4s var(--ease), transform .4s var(--ease); }
.fchip:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1px var(--ink); }
.fchip.is-on { background: var(--ink); color: #fff; }
.ptable { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 24px; margin-top: 28px; align-items: start; }
.pgrid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); gap: 8px; }
.ptile { opacity: 0; transform: translateY(16px) scale(.96); transition: opacity .7s var(--ease), transform .9s var(--ease); transition-delay: calc(var(--d8) * 40ms); }
.pgrid.is-shown .ptile { opacity: 1; transform: none; }
.pgrid.is-shown .ptile.is-dim { opacity: .22; transform: scale(.97); transition-delay: 0s; }
.ptile button { width: 100%; aspect-ratio: 1 / 1.08; display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding: 10px; border-radius: 16px; background: var(--card); box-shadow: var(--hair); transition: transform .5s var(--ease), box-shadow .5s var(--ease), background-color .4s var(--ease), color .4s var(--ease); }
.ptile button:hover, .ptile.is-active button { transform: translateY(-3px); box-shadow: var(--hair), var(--lift); }
.ptile.is-active button { background: var(--ink); color: #fff; }
.ptile.is-active .pt-n, .ptile.is-active .pt-fam { color: rgba(255,255,255,.6); }
.pt-n { font-size: 10px; color: var(--mute); }
.pt-sym { margin-top: auto; font-size: clamp(22px, 2.3vw, 34px); font-weight: 700; letter-spacing: -.04em; line-height: 1; }
.pt-name { margin-top: 6px; font-size: 11.5px; font-weight: 500; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.4em; }
.pt-fam { margin-top: 4px; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: var(--mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.inspector { position: sticky; top: 96px; padding: 20px; border-radius: 26px; }
.insp-top { display: flex; justify-content: space-between; font-size: 11px; color: var(--mute); }
.insp-logo { position: relative; height: 190px; display: grid; place-items: center; margin: 8px 0 4px; color: var(--ink); animation: pop .7s var(--ease) both; }
.insp-logo::before { content: ""; position: absolute; width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(closest-side, color-mix(in srgb, var(--tint) 26%, transparent), transparent); z-index: 0; }
.insp-logo > * { position: relative; }
@keyframes pop { from { opacity: 0; transform: scale(.7) rotate(-6deg); } 60% { transform: scale(1.04); } }
.insp-name { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -.035em; line-height: 1.05; }
.insp-fam { margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--mute); }
.insp-used { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); }
.insp-used > p.mono { margin: 0 0 8px; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.insp-used ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; font-size: 14px; }
.insp-used li::before { content: "→ "; color: var(--faint); }
.insp-none { margin: 0; font-size: 14px; color: var(--ink-2); }
@media (max-width: 1080px) {
  .ptable { grid-template-columns: 1fr; }
  .inspector { position: relative; top: 0; }
}
@media (max-width: 720px) {
  .pgrid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px; }
  .ptile { transition-delay: calc(var(--d4) * 40ms); }
  .ptile button { padding: 8px; border-radius: 12px; }
  .pt-name { font-size: 10px; }
  .pt-fam { display: none; }
}
}
`}</style>
    </section>
  );
}
