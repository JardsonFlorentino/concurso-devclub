"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  GARANTIA_DESCRIPTION,
  GARANTIA_PASSOS,
  GARANTIA_SELO,
  GARANTIA_TAG,
  GARANTIA_TITLE,
} from "@/data/garantia";

gsap.registerPlugin(ScrollTrigger);

const RING_RADIUS = 82;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const RING_TEXT = GARANTIA_SELO.ring.repeat(2);

export function GarantiaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".garantia-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="garantia"
      ref={sectionRef}
      className="relative bg-background-deep py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="overflow-hidden rounded-[14px] border-[0.5px] border-accent-1/25 bg-accent-1/[0.04] px-7 py-12 backdrop-blur-sm md:px-12 md:py-16">
          <header className="garantia-reveal flex flex-col items-start gap-5">
            <span className="rounded-full border-[0.5px] border-accent-1/35 bg-accent-1/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-1">
              {GARANTIA_TAG}
            </span>
            <h2 className="max-w-[18ch] text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
              {GARANTIA_TITLE.before}
              <span className="text-accent-1">{GARANTIA_TITLE.highlight}</span>
              {GARANTIA_TITLE.after}
            </h2>
            <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-gray-300">
              {GARANTIA_DESCRIPTION}
            </p>
          </header>

          <div className="mt-14 flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="garantia-reveal relative h-[188px] w-[188px] shrink-0">
              <svg
                viewBox="0 0 200 200"
                aria-hidden="true"
                className="garantia-ring absolute inset-0 h-full w-full"
              >
                <defs>
                  <path
                    id="garantia-ring-path"
                    d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"
                    fill="none"
                  />
                </defs>
                <text
                  fill="currentColor"
                  className="text-accent-1"
                  style={{ fontSize: "11px" }}
                >
                  <textPath
                    href="#garantia-ring-path"
                    textLength={RING_LENGTH}
                    lengthAdjust="spacing"
                  >
                    {RING_TEXT}
                  </textPath>
                </text>
              </svg>

              <span className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full border-[0.5px] border-accent-1/30 bg-accent-1/[0.06]">
                <span className="text-[3.25rem] font-semibold leading-none tracking-[-0.04em] text-accent-1">
                  {GARANTIA_SELO.value}
                </span>
                <span className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-300">
                  {GARANTIA_SELO.unit}
                </span>
              </span>
            </div>

            <ol className="flex flex-1 flex-col gap-8">
              {GARANTIA_PASSOS.map((passo, index) => (
                <li
                  key={passo.title}
                  className="garantia-reveal flex gap-5 border-b border-white/[0.08] pb-8 last:border-b-0 last:pb-0"
                >
                  <span className="shrink-0 text-sm font-semibold tabular-nums tracking-[0.08em] text-accent-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-white-light">
                      {passo.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-relaxed text-gray-300">
                      {passo.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
