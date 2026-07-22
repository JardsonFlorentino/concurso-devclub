"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  MEC_DESCRIPTION,
  MEC_DIPLOMA,
  MEC_SELOS,
  MEC_TITLE,
} from "@/data/mec";

gsap.registerPlugin(ScrollTrigger);

export function MecSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".mec-reveal",
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
      id="mec"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-[130px]"
    >
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-14 px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="mec-reveal max-w-[18ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {MEC_TITLE.before}
            <span className="text-accent-1">{MEC_TITLE.highlight}</span>
            {MEC_TITLE.after}
          </h2>
          <p className="mec-reveal max-w-[50ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {MEC_DESCRIPTION}
          </p>

          <ul className="mec-reveal mt-2 flex flex-wrap gap-3">
            {MEC_SELOS.map((selo) => (
              <li
                key={selo.label}
                className="flex min-w-[132px] flex-col gap-1 rounded-[14px] border-[0.5px] border-accent-1/25 bg-accent-1/[0.06] px-5 py-4"
              >
                <span className="text-[1.25rem] font-semibold tracking-[-0.02em] text-accent-1">
                  {selo.value}
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-gray-300">
                  {selo.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <span
            aria-hidden="true"
            data-parallax="40"
            className="plataforma-glow pointer-events-none absolute -inset-10 -z-10"
          />

          <figure className="mec-reveal rounded-[14px] border-[0.5px] border-accent-2/30 bg-white/[0.04] p-3 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 rounded-[10px] border border-white/10 bg-black-dark/60 px-8 py-12 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-1">
                {MEC_DIPLOMA.institution}
              </span>

              <div className="flex flex-col gap-3">
                <h3 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-white-light md:text-[1.75rem]">
                  {MEC_DIPLOMA.award}
                </h3>
                <p className="text-sm text-gray-300">conferido a</p>
                <p className="text-[1.25rem] font-semibold tracking-[-0.01em] text-accent-1 md:text-[1.5rem]">
                  {MEC_DIPLOMA.student}
                </p>
                <p className="text-sm leading-relaxed text-gray-300">
                  {MEC_DIPLOMA.course} · {MEC_DIPLOMA.workload}
                </p>
              </div>

              <div className="mt-2 flex flex-col items-center gap-2">
                <span className="h-px w-[180px] bg-white/20" />
                <span className="text-sm font-medium text-white-light">
                  {MEC_DIPLOMA.signature}
                </span>
                <span className="text-xs text-gray-500">
                  {MEC_DIPLOMA.signatureRole}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <span>{MEC_DIPLOMA.registry}</span>
                <span>{MEC_DIPLOMA.issuedAt}</span>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
