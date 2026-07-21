"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setSmoothScrollInstance(next: Lenis | null) {
  instance = next;
}

export function getSmoothScrollInstance() {
  return instance;
}

export function scrollToPosition(top: number) {
  const lenis = getSmoothScrollInstance();
  if (lenis) {
    lenis.scrollTo(top, { immediate: true });
    return;
  }
  window.scrollTo({ top, behavior: "auto" });
}
