"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Bot,
  Briefcase,
  HeartPulse,
  LifeBuoy,
  UserSearch,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  ALEM_DO_CODIGO,
  ALEM_DO_CODIGO_SUBTITLE,
  ALEM_DO_CODIGO_TITLE,
  type AlemDoCodigoIcon,
} from "@/data/alemDoCodigo";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<AlemDoCodigoIcon, LucideIcon> = {
  UserSearch,
  HeartPulse,
  Video,
  Bot,
  LifeBuoy,
  Users,
  Briefcase,
};

export function AlemDoCodigoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".alem-reveal",
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
      id="alem-do-codigo"
      ref={sectionRef}
      className="relative bg-background pb-[190px] pt-[160px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--b1" />
        <div className="absolute inset-0 bg-black-dark/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="alem-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {ALEM_DO_CODIGO_TITLE.before}
            <span className="text-accent-1">
              {ALEM_DO_CODIGO_TITLE.highlight}
            </span>
            {ALEM_DO_CODIGO_TITLE.after}
          </h2>
          <p className="alem-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {ALEM_DO_CODIGO_SUBTITLE}
          </p>
        </header>

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ALEM_DO_CODIGO.map((item, index) => {
            const Icon = ICONS[item.icon];
            const featured = index === 0;

            return (
              <li
                key={item.title}
                className={`alem-reveal group flex gap-5 rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03] p-7 backdrop-blur-sm transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent-2/50 hover:bg-white/[0.05] ${
                  featured
                    ? "flex-col md:col-span-2 md:flex-row md:items-center md:gap-7"
                    : "flex-col"
                }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-[14px] border-[0.5px] border-accent-1/25 bg-accent-1/[0.08] text-accent-1 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent-1/50 ${
                    featured ? "h-14 w-14 md:h-16 md:w-16" : "h-11 w-11"
                  }`}
                >
                  <Icon
                    size={featured ? 28 : 20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>

                <div className="flex flex-col gap-2">
                  <h3
                    className={`font-semibold leading-snug tracking-[-0.01em] text-white-light ${
                      featured ? "text-[1.375rem]" : "text-[1.0625rem]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-gray-300 ${
                      featured ? "text-base" : "text-[0.9375rem]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
