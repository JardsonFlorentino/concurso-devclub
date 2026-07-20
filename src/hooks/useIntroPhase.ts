"use client";

import { useSyncExternalStore } from "react";

export type IntroPhase = "intro" | "revealed";

const SESSION_KEY = "devclub:intro-seen";

function decideIntroPlayback(): boolean {
  if (typeof window === "undefined") return false;

  const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  sessionStorage.setItem(SESSION_KEY, "1");
  return !alreadySeen && !prefersReducedMotion;
}

export const introPlaybackEnabled = decideIntroPlayback();

let phase: IntroPhase = introPlaybackEnabled ? "intro" : "revealed";
const subscribers = new Set<() => void>();

export function markRevealed() {
  if (phase === "revealed") return;
  phase = "revealed";
  document.documentElement.removeAttribute("data-intro");
  subscribers.forEach((notify) => notify());
}

function subscribe(onChange: () => void) {
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(
    subscribe,
    () => phase,
    () => "revealed" as IntroPhase,
  );
}
