import { CERTIFICATIONS, SECTION_INDEX } from "@/lib/data";

export default function Certifications() {
  const n = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <div className="wrap certs-grid">
        <div className="certs-head">
          <p className="tag rv">
            <b>{SECTION_INDEX.certifications}</b> — Certifications
          </p>
          <h2 id="certs-title" className="h-display mt-5">
            <span className="rv-mask">
              <span>
                Always <span className="accent">learning.</span>
              </span>
            </span>
          </h2>
          <p className="certs-count mono rv">
            {String(n).padStart(2, "0")} {n === 1 ? "certification" : "certifications"} on record
          </p>
        </div>

        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} tabIndex={0} className="rv" style={{ "--i": i } as React.CSSProperties}>
              <span className="c-n mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="c-body">
                <span className="c-title">{c.title}</span>
                <span className="c-issuer">{c.issuer}</span>
              </span>
              <span className="c-arrow" aria-hidden>
                ↗
              </span>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
@layer components {
.certs { background: var(--card); border-block: 1px solid var(--line); }
.certs-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 80px); align-items: start; }
.certs-head { position: sticky; top: 110px; }
.certs-count { margin: 20px 0 0; font-size: 12px; color: var(--mute); text-transform: uppercase; letter-spacing: .06em; }
.certs-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.certs-list li { position: relative; display: grid; grid-template-columns: 56px minmax(0,1fr) 32px; align-items: center; gap: 16px; padding: 28px 20px; border-bottom: 1px solid var(--line); isolation: isolate; overflow: hidden; border-radius: 0; outline-offset: -2px; transition: color .5s var(--ease); }
.certs-list li::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--ink); transform: scaleX(0); transform-origin: 0 50%; transition: transform .7s var(--ease); }
.certs-list li:hover, .certs-list li:focus-visible { color: #fff; }
.certs-list li:hover::before, .certs-list li:focus-visible::before { transform: scaleX(1); }
.c-n { font-size: 12px; color: var(--mute); transition: color .5s; }
.c-body { display: grid; gap: 6px; }
.c-title { font-size: clamp(20px, 2vw, 28px); font-weight: 600; letter-spacing: -.03em; line-height: 1.15; }
.c-issuer { font-size: 14px; color: var(--mute); transition: color .5s; }
.certs-list li:hover .c-n, .certs-list li:hover .c-issuer, .certs-list li:focus-visible .c-n, .certs-list li:focus-visible .c-issuer { color: rgba(255,255,255,.65); }
.c-arrow { font-size: 22px; opacity: 0; transform: translateX(-14px); transition: opacity .5s var(--ease), transform .6s var(--ease); }
.certs-list li:hover .c-arrow, .certs-list li:focus-visible .c-arrow { opacity: 1; transform: none; }
@media (max-width: 860px) {
  .certs-grid { grid-template-columns: 1fr; }
  .certs-head { position: relative; top: 0; }
  .certs-list li { grid-template-columns: 36px minmax(0,1fr) 24px; padding: 22px 12px; }
}
}
`}</style>
    </section>
  );
}
