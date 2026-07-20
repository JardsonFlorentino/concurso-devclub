"use client";

import { useEffect, useState } from "react";

const SCROLLED_THRESHOLD_PX = 80;
const DIRECTION_TOLERANCE_PX = 6;

export interface ScrollState {
  isScrolled: boolean;
  isHidden: boolean;
}

export function useScrollDirection(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    isScrolled: false,
    isHidden: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameRequested = false;

    const evaluate = () => {
      frameRequested = false;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const isScrolled = currentScrollY > SCROLLED_THRESHOLD_PX;

      setState((previous) => {
        if (Math.abs(delta) < DIRECTION_TOLERANCE_PX) {
          return previous.isScrolled === isScrolled
            ? previous
            : { ...previous, isScrolled };
        }

        lastScrollY = currentScrollY;
        const isHidden = delta > 0 && isScrolled;

        return previous.isScrolled === isScrolled && previous.isHidden === isHidden
          ? previous
          : { isScrolled, isHidden };
      });
    };

    const onScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(evaluate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
