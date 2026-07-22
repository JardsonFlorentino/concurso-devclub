"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useIntroPhase } from "./useIntroPhase";

export function useHeroReveal(scopeRef: React.RefObject<HTMLElement | null>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const introPhase = useIntroPhase();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    if (prefersReducedMotion) return;

    const header = document.querySelector("header");

    const context = gsap.context(() => {
      if (introPhase === "intro") {
        gsap.set(".hero-reveal", { opacity: 0, y: 28 });
        if (header) gsap.set(header, { opacity: 0 });
        return;
      }

      gsap.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
        },
      );

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 },
        );
      }
    }, scope);

    return () => context.revert();
  }, [scopeRef, prefersReducedMotion, introPhase]);
}
