"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Smooth-scroll to an element id, element, or y offset. Falls back to native scroll. */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (typeof el !== "number") {
    // move focus for keyboard / screen-reader users without a second jump
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function ScrollProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    let raf = requestAnimationFrame(function loop(t) {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
