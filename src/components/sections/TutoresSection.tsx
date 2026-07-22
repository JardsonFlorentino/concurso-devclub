"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TutoresCoverflow } from "@/components/ui/TutoresCoverflow";
import { TUTORES, TUTORES_SUBTITLE, TUTORES_TITLE } from "@/data/tutores";

gsap.registerPlugin(ScrollTrigger);

export function TutoresSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".tutores-reveal",
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
      id="tutores"
      ref={sectionRef}
      className="relative bg-background-deep py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="tutores-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {TUTORES_TITLE.before}
            <span className="text-accent-1">{TUTORES_TITLE.highlight}</span>
            {TUTORES_TITLE.after}
          </h2>
          <p className="tutores-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {TUTORES_SUBTITLE}
          </p>
        </header>

        <div className="tutores-reveal">
          <TutoresCoverflow tutores={TUTORES} />
        </div>
      </div>
    </section>
  );
}
