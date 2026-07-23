"use client";

import { useEffect, useState, type RefObject } from "react";

interface Options {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export function useInView(
  target: RefObject<Element | null>,
  { rootMargin = "0px", threshold = 0, once = false }: Options = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, rootMargin, threshold, once]);

  return inView;
}
