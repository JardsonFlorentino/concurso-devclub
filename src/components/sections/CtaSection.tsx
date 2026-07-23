"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CTA_BUTTON, CTA_HEADLINE, CTA_SUBTITLE } from "@/data/footer";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".cta-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-[150px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--a2" />
        <div className="absolute inset-0 bg-black-dark/50" />
      </div>

      <div
        data-parallax="-20"
        className="relative z-10 mx-auto flex max-w-[1180px] flex-col items-center gap-9 px-6 text-center md:px-10"
      >
        <h2 className="cta-reveal text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-white-light">
          {CTA_HEADLINE}
        </h2>
        <p className="cta-reveal max-w-[46ch] text-base leading-relaxed text-gray-300">
          {CTA_SUBTITLE}
        </p>
        <div className="cta-reveal">
          <span data-cursor="accent">
            <MagneticButton href={CTA_BUTTON.href} className="px-9 py-5 text-lg">
              {CTA_BUTTON.label}
            </MagneticButton>
          </span>
        </div>
      </div>
    </section>
  );
}
