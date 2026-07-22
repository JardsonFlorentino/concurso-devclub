"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  ALUNOS,
  COMUNIDADE_HIGHLIGHT_LABEL,
  COMUNIDADE_SUBTITLE,
  COMUNIDADE_TITLE,
  DEPOIMENTOS,
} from "@/data/alunos";

gsap.registerPlugin(ScrollTrigger);

const EASE_STANDARD = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function ComunidadeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".alunos-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="comunidade"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--a1" />
        <div className="aurora-blob aurora-blob--a2" />
        <div className="absolute inset-0 bg-black-dark/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <h2 className="alunos-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {COMUNIDADE_TITLE.before}
            <span className="text-accent-1">{COMUNIDADE_TITLE.highlight}</span>
            {COMUNIDADE_TITLE.after}
          </h2>
          <p className="alunos-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {COMUNIDADE_SUBTITLE}
          </p>
        </header>

        <p className="alunos-reveal mt-14 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-1">
          <span aria-hidden="true" className="h-px w-8 bg-accent-1/40" />
          {COMUNIDADE_HIGHLIGHT_LABEL}
        </p>

        <ul
          onPointerLeave={() => setActiveIndex(null)}
          className="mt-6 flex max-w-[720px] flex-col border-t border-white/10"
        >
          {ALUNOS.map((aluno, index) => {
            const isActive = activeIndex === index;

            return (
              <li
                key={aluno.name}
                onPointerEnter={() => setActiveIndex(index)}
                data-cursor="hover"
                className={`alunos-reveal aluno-row flex cursor-default items-center gap-5 border-b border-white/10 py-5 transition-opacity duration-500 ${EASE_STANDARD} md:gap-6 md:py-6 ${
                  activeIndex !== null && !isActive
                    ? "lg:opacity-35"
                    : "opacity-100"
                }`}
              >
                <span
                  className={`aluno-portrait relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 transition-[box-shadow] duration-500 ${EASE_STANDARD} md:h-16 md:w-16 ${
                    isActive ? "ring-accent-1/60" : "ring-white/10"
                  }`}
                >
                  <Image
                    src={aluno.photo}
                    alt={aluno.name}
                    width={128}
                    height={128}
                    className={`aluno-portrait-img h-full w-full object-cover transition-[filter,transform] duration-700 ${EASE_STANDARD} ${
                      isActive ? "scale-105 grayscale-0" : "scale-100 grayscale"
                    }`}
                  />
                </span>

                <div
                  className={`aluno-info flex min-w-0 flex-col gap-0.5 transition-transform duration-500 ${EASE_STANDARD} ${
                    isActive ? "lg:translate-x-2" : ""
                  }`}
                >
                  <h3
                    className={`text-[clamp(1.75rem,2.6vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] transition-colors duration-500 ${EASE_STANDARD} ${
                      isActive ? "text-accent-1" : "text-white-light"
                    }`}
                  >
                    {aluno.name}
                  </h3>
                  <p className="flex flex-col text-sm leading-snug text-gray-300 sm:flex-row sm:items-center sm:text-[0.9375rem]">
                    <span className="whitespace-nowrap">{aluno.role}</span>
                    <span className="whitespace-nowrap text-gray-500">
                      <span aria-hidden="true" className="hidden px-2 sm:inline">
                        ·
                      </span>
                      {aluno.location}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS.map((depoimento) => (
            <figure
              key={depoimento.name}
              className="alunos-reveal flex flex-col justify-between gap-8 rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03] p-7 backdrop-blur-sm transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-2/50 hover:bg-white/[0.05]"
            >
              <blockquote className="text-[1.0625rem] italic leading-relaxed text-gray-300">
                “{depoimento.quote}”
              </blockquote>
              <figcaption className="flex flex-col gap-1">
                <span className="text-[0.9375rem] font-semibold text-white-light">
                  {depoimento.name}
                </span>
                <span className="text-sm text-gray-300">
                  {depoimento.role} · {depoimento.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
