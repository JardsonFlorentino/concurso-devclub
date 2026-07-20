"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ManifestoStat } from "@/data/manifesto";

gsap.registerPlugin(ScrollTrigger);

function formatStat(stat: ManifestoStat, value: number) {
  return `${stat.prefix ?? ""}${value.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;
}

export function StatCounter({ stat }: { stat: ManifestoStat }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    const valueElement = valueRef.current;
    const underlineElement = underlineRef.current;
    if (!card || !valueElement || !underlineElement) return;

    if (prefersReducedMotion) {
      valueElement.textContent = formatStat(stat, stat.value);
      gsap.set(underlineElement, { scaleX: 1 });
      return;
    }

    const counter = { value: 0 };
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      timeline
        .to(counter, {
          value: stat.value,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            valueElement.textContent = formatStat(stat, counter.value);
          },
        })
        .fromTo(
          underlineElement,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power3.out" },
          0.2,
        );
    }, card);

    return () => context.revert();
  }, [stat, prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-start gap-4 rounded-[14px] border-[0.5px] border-white/10 bg-white/[0.03] p-6 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 md:p-7"
    >
      <span className="text-[clamp(1.875rem,3.6vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-white-light tabular-nums">
        <span ref={valueRef}>{formatStat(stat, 0)}</span>
      </span>
      <span
        ref={underlineRef}
        className="h-px w-14 origin-left bg-accent-1"
      />
      <span className="text-[13px] leading-snug text-gray-400">{stat.label}</span>
    </div>
  );
}
