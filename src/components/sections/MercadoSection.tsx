"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  MERCADO_FOOTNOTE,
  MERCADO_NIVEIS,
  MERCADO_SERIES,
  MERCADO_SUBTITLE,
  MERCADO_TITLE,
} from "@/data/mercado";

gsap.registerPlugin(ScrollTrigger);

const MAX_VALOR = Math.max(
  ...MERCADO_NIVEIS.flatMap((nivel) => [nivel.brasil, nivel.internacional]),
);

function formatBRL(value: number) {
  return `R$ ${Math.round(value / 1000)} mil`;
}

function Barra({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent-1" | "accent-2";
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[104px] shrink-0 text-sm text-gray-300 md:w-[124px]">
        {label}
      </span>

      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <span
          className={`mercado-bar absolute inset-y-0 left-0 origin-left rounded-full ${
            tone === "accent-1" ? "bg-accent-1" : "bg-accent-2"
          }`}
          style={{ width: `${(value / MAX_VALOR) * 100}%` }}
        />
      </div>

      <span className="w-[92px] shrink-0 text-right text-sm font-medium tabular-nums text-white-light">
        {formatBRL(value)}
      </span>
    </div>
  );
}

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
        <header className="flex flex-col gap-4">
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

        <div className="mt-10 flex max-w-[860px] flex-col gap-10">
          {MERCADO_NIVEIS.map((nivel) => (
            <div key={nivel.level} className="mercado-reveal flex flex-col gap-4">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white-light">
                {nivel.level}
              </h3>

              <div className="flex flex-col gap-3">
                <Barra
                  label={MERCADO_SERIES.brasil}
                  value={nivel.brasil}
                  tone="accent-1"
                />
                <Barra
                  label={MERCADO_SERIES.internacional}
                  value={nivel.internacional}
                  tone="accent-2"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mercado-reveal mt-10 max-w-[58ch] text-xs leading-relaxed text-gray-500">
          {MERCADO_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}
