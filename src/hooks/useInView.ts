"use client";

import { useEffect, useState, type RefObject } from "react";

interface Options {
  rootMargin?: string;
  threshold?: number;
}

export function useInView(
  target: RefObject<Element | null>,
  { rootMargin = "0px", threshold = 0 }: Options = {},
): boolean {
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = target.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, rootMargin, threshold]);

  return inView;
}
