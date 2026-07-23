"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MercadoComparador } from "@/components/ui/MercadoComparador";
import {
  MERCADO_FOOTNOTE,
  MERCADO_SERIES,
  MERCADO_SUBTITLE,
  MERCADO_TITLE,
} from "@/data/mercado";

gsap.registerPlugin(ScrollTrigger);

export function MercadoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".mercado-reveal",
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

      gsap.fromTo(
        ".mercado-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.1,
          transformOrigin: "left center",
          scrollTrigger: { trigger: section, start: "top 68%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="mercado"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="mercado-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {MERCADO_TITLE.before}
            <span className="text-accent-1">{MERCADO_TITLE.highlight}</span>
            {MERCADO_TITLE.after}
          </h2>
          <p className="mercado-reveal max-w-[58ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {MERCADO_SUBTITLE}
          </p>
        </header>

        <div className="mercado-reveal mt-12 flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-accent-1"
            />
            {MERCADO_SERIES.brasil}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-accent-2"
            />
            {MERCADO_SERIES.internacional}
          </span>
        </div>

        <MercadoComparador />

        <p className="mercado-reveal mt-10 max-w-[58ch] text-xs leading-relaxed text-gray-500">
          {MERCADO_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}
