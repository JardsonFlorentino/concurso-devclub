"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ParallaxTarget {
  element: HTMLElement;
  amount: number;
}

export function ScrollParallax() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const targets: ParallaxTarget[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    )
      .map((element) => ({
        element,
        amount: parseFloat(element.dataset.parallax ?? "0"),
      }))
      .filter((target) => target.amount);

    if (!targets.length) return;

    const offsets = new WeakMap<HTMLElement, number>();

    const update = () => {
      const viewport = window.innerHeight;

      for (const { element, amount } of targets) {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const relative = gsap.utils.clamp(
          -1.2,
          1.2,
          center / viewport - 0.5,
        );
        offsets.set(element, relative * amount);
      }

      for (const { element } of targets) {
        element.style.transform = `translate3d(0, ${offsets.get(element)}px, 0)`;
      }
    };

    update();
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      for (const { element } of targets) {
        element.style.transform = "";
      }
    };
  }, [prefersReducedMotion]);

  return null;
}
