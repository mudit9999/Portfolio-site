"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const req = () => (raf ||= requestAnimationFrame(tick));
    tick();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);

  // active section
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main > section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // slide the ink indicator under the active link
  useLayoutEffect(() => {
    const place = () => {
      const el = pill.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      const ind = indicator.current;
      if (!ind) return;
      if (!el) {
        ind.style.opacity = "0";
        return;
      }
      ind.style.opacity = "1";
      ind.style.width = `${el.offsetWidth}px`;
      ind.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // mobile overlay: lock scroll, Esc closes
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release the scroll lock first
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav-progress" ref={bar} aria-hidden />
      <div className="nav-row">
        <a href="#top" className="nav-brand" onClick={(e) => go(e, "top")}>
          <span className="nav-mark mono" aria-hidden>
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav aria-label="Primary" className="nav-desktop">
          <div ref={pill} className="nav-pill">
            <span ref={indicator} className="nav-ind" aria-hidden />
            <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  aria-current={active === n.id ? "true" : undefined}
                  className={active === n.id ? "is-active" : ""}
                  onClick={(e) => go(e, n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
            </ul>
          </div>
        </nav>

        <button
          ref={menuBtn}
          className="nav-menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="mobile-menu" className="nav-overlay" aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="nav-overlay-foot mono">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
      </div>

      <style>{`
@layer components {
.nav { position: fixed; inset: 0 0 auto; z-index: 50; pointer-events: none; }
.nav-progress { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--ink); transform: scaleX(0); transform-origin: 0 50%; z-index: 3; }
.nav-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px var(--gutter); }
.nav-row > * { pointer-events: auto; }
.nav-brand { display: inline-flex; align-items: center; gap: 12px; border-radius: 999px; }
.nav-mark { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; letter-spacing: .02em; box-shadow: inset 0 0 0 1px var(--ink); background: transparent; transition: background-color .5s var(--ease), color .5s var(--ease), transform .9s var(--ease); }
.nav-brand:hover .nav-mark { transform: rotate(360deg); }
.is-scrolled .nav-mark { background: var(--ink); color: #fff; }
.nav-name { font-weight: 600; letter-spacing: -.02em; font-size: 15px; transition: opacity .5s var(--ease), transform .5s var(--ease); }
.is-scrolled .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }
.nav-pill ul { display: flex; gap: 2px; list-style: none; margin: 0; padding: 0; }
.nav-pill { position: relative; padding: 5px; border-radius: 999px; transition: background-color .5s var(--ease), box-shadow .5s var(--ease); }
.is-scrolled .nav-pill, .is-scrolled .nav-menu { background: rgba(255,255,255,.72); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: var(--hair), 0 10px 30px -16px rgba(13,13,13,.25); }
.nav-pill a { position: relative; z-index: 1; display: block; padding: 9px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--ink-2); transition: color .4s var(--ease); }
.nav-pill a:hover { color: var(--ink); }
.nav-pill a.is-active { color: #fff; }
.nav-ind { position: absolute; top: 5px; bottom: 5px; left: 0; border-radius: 999px; background: var(--ink); opacity: 0; transition: transform .6s var(--ease), width .6s var(--ease), opacity .3s; }
.nav-menu { display: none; height: 42px; padding: 0 20px; border-radius: 999px; font-size: 14px; font-weight: 500; box-shadow: inset 0 0 0 1px rgba(13,13,13,.18); position: relative; z-index: 2; }
.is-open .nav-menu { background: var(--ink) !important; color: #fff; }
.nav-overlay { position: fixed; inset: 0; z-index: 1; background: var(--paper); display: flex; flex-direction: column; justify-content: center; padding: 90px var(--gutter) 40px; clip-path: circle(0% at calc(100% - 50px) 34px); transition: clip-path .8s var(--ease); pointer-events: none; }
.is-open .nav-overlay { clip-path: circle(150% at calc(100% - 50px) 34px); pointer-events: auto; }
.nav-overlay ol { list-style: none; margin: 0; padding: 0; }
.nav-overlay li { overflow: hidden; border-bottom: 1px solid var(--line); }
.nav-overlay li a { display: flex; align-items: baseline; gap: 16px; padding: 14px 0; font-size: clamp(34px, 10vw, 56px); font-weight: 700; letter-spacing: -.045em; line-height: 1.05; transform: translateY(110%); transition: transform .8s var(--ease); transition-delay: calc(var(--i) * 60ms + 120ms); }
.nav-overlay li a span { font-size: 12px; color: var(--mute); letter-spacing: 0; font-weight: 400; }
.is-open .nav-overlay li a { transform: none; }
.nav-overlay-foot { margin-top: 32px; font-size: 13px; color: var(--mute); }
@media (max-width: 860px) {
  .nav-desktop { display: none; }
  .nav-menu { display: inline-flex; align-items: center; }
}
@media (min-width: 861px) { .nav-overlay { display: none; } }
}
`}</style>
    </header>
  );
}
