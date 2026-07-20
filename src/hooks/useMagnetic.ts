"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";


export function useMagnetic<T extends HTMLElement>(strength = 8) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const moveX = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3.out" });

    const onPointerMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      
      const relativeX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const relativeY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
      moveX(gsap.utils.clamp(-1, 1, relativeX) * strength);
      moveY(gsap.utils.clamp(-1, 1, relativeY) * strength);
    };

    const onPointerLeave = () => {
      moveX(0);
      moveY(0);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);
    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(element);
    };
  }, [strength, prefersReducedMotion]);

  return ref;
}
