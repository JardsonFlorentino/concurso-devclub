"use client";

import { useSyncExternalStore } from "react";

let introComplete = false;
const subscribers = new Set<() => void>();

function subscribe(onChange: () => void) {
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}

export function markIntroComplete() {
  if (introComplete) return;
  introComplete = true;
  subscribers.forEach((notify) => notify());
}

export function useIntroComplete(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => introComplete,
    () => false,
  );
}
