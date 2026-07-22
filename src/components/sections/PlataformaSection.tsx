"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessagesSquare,
  MonitorPlay,
  Route,
  Sparkles,
  TerminalSquare,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  PLATAFORMA_DESCRIPTION,
  PLATAFORMA_FEATURES,
  PLATAFORMA_TITLE,
  type PlataformaIcon,
} from "@/data/plataforma";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<PlataformaIcon, LucideIcon> = {
  MonitorPlay,
  Route,
  MessagesSquare,
  Sparkles,
  TerminalSquare,
  Trophy,
};

export function PlataformaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".plataforma-reveal",
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
      id="plataforma"
      ref={sectionRef}
      className="relative overflow-hidden bg-background-deep py-[130px]"
    >
      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-14 px-6 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-20">
        <header className="flex flex-col gap-5 lg:sticky lg:top-32">
          <h2 className="plataforma-reveal text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {PLATAFORMA_TITLE.before}
            <span className="text-accent-1">{PLATAFORMA_TITLE.highlight}</span>
            {PLATAFORMA_TITLE.after}
          </h2>
          <p className="plataforma-reveal max-w-[46ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {PLATAFORMA_DESCRIPTION}
          </p>
        </header>

        <div className="relative">
          <span
            aria-hidden="true"
            data-parallax="40"
            className="plataforma-glow pointer-events-none absolute -inset-10 -z-10"
          />

          <ul className="grid gap-4 sm:grid-cols-2">
            {PLATAFORMA_FEATURES.map((feature) => {
              const Icon = ICONS[feature.icon];

              return (
                <li
                  key={feature.title}
                  className="plataforma-reveal group flex flex-col gap-4 rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03] p-6 backdrop-blur-sm transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent-2/50 hover:bg-white/[0.05]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border-[0.5px] border-accent-1/25 bg-accent-1/[0.08] text-accent-1 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent-1/50">
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  </span>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-white-light">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
