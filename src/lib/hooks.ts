"use client";

import { useEffect, useState, type RefObject } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True while the element intersects the viewport (or once, with `once`). */
export function useInView(ref: RefObject<Element | null>, { threshold = 0, rootMargin = "0px", once = false } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (once && e.isIntersecting) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

/**
 * Calls `onProgress(p)` on scroll with p in [0, 1]: 0 when the element's top hits
 * `start` (fraction of viewport height), 1 when its bottom reaches `end`.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { start = 0.8, end = 0.6 } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = r.top - vh * start;
      const span = r.height - vh * end + vh * start;
      onProgress(Math.min(1, Math.max(0, -from / span)));
    };
    const req = () => (raf ||= requestAnimationFrame(tick));
    tick();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, [ref, onProgress, start, end]);
}
