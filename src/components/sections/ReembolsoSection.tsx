"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  REEMBOLSO_SELO,
  REEMBOLSO_TAG,
  REEMBOLSO_TEXT,
  REEMBOLSO_TITLE,
} from "@/data/reembolso";

gsap.registerPlugin(ScrollTrigger);

export function ReembolsoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".reembolso-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="reembolso"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="flex flex-col items-center gap-12 overflow-hidden rounded-[14px] bg-accent-1 px-7 py-14 text-black-dark md:flex-row md:items-center md:justify-between md:gap-16 md:px-14 md:py-16">
          <div className="flex flex-col items-start gap-5">
            <span className="reembolso-reveal rounded-full border-[0.5px] border-black-dark/25 bg-black-dark/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-black-dark/80">
              {REEMBOLSO_TAG}
            </span>
            <h2 className="reembolso-reveal text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-black-dark">
              {REEMBOLSO_TITLE}
            </h2>
            <p className="reembolso-reveal max-w-[54ch] text-[1.0625rem] leading-relaxed text-black-dark/80">
              {REEMBOLSO_TEXT}
            </p>
          </div>

          <div className="reembolso-reveal relative flex h-[188px] w-[188px] shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-black-dark/15"
            />
            <span className="flex h-[136px] w-[136px] flex-col items-center justify-center gap-1 rounded-full border border-black-dark/20 bg-black-dark/[0.06]">
              <Check
                size={40}
                strokeWidth={2.5}
                aria-hidden="true"
                className="text-black-dark"
              />
              <span className="flex items-baseline gap-1 text-black-dark">
                <span className="text-[1.5rem] font-semibold leading-none tracking-[-0.03em]">
                  {REEMBOLSO_SELO.value}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em]">
                  {REEMBOLSO_SELO.unit}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
