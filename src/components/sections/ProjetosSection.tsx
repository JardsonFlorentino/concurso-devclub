"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ProjetoFace } from "@/components/ui/ProjetoFace";
import { ProjetosRing } from "@/components/ui/ProjetosRing";
import {
  PROJETOS,
  PROJETOS_SUBTITLE,
  PROJETOS_TITLE,
} from "@/data/projetos";

gsap.registerPlugin(ScrollTrigger);

export function ProjetosSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".projetos-reveal",
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
      id="projetos"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="projetos-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {PROJETOS_TITLE.before}
            <span className="text-accent-1">{PROJETOS_TITLE.highlight}</span>
            {PROJETOS_TITLE.after}
          </h2>
          <p className="projetos-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {PROJETOS_SUBTITLE}
          </p>
        </header>

        {prefersReducedMotion ? (
          <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROJETOS.map((projeto) => (
              <li
                key={projeto.name}
                className="flex flex-col overflow-hidden rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03]"
              >
                <div className="relative h-[168px] shrink-0 overflow-hidden">
                  <ProjetoFace
                    projeto={projeto}
                    sizes="(max-width: 640px) 100vw, 360px"
                  />
                </div>

                <div className="flex flex-col gap-3 p-6">
                  <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-white-light">
                    {projeto.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {projeto.description}
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {projeto.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border-[0.5px] border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="projetos-reveal">
            <ProjetosRing projetos={PROJETOS} />
          </div>
        )}
      </div>
    </section>
  );
}
