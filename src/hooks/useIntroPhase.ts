"use client";

import { useSyncExternalStore } from "react";

export type IntroPhase = "intro" | "revealed";

function decideIntroPlayback(): boolean {
  if (typeof window === "undefined") return false;

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
