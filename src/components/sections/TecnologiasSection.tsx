"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  TECNOLOGIAS,
  TECNOLOGIAS_SUBTITLE,
  TECNOLOGIAS_TITLE,
  type Tecnologia,
} from "@/data/tecnologias";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_SPOTLIGHT = "-9999px";

function TechCell({ tech, lit }: { tech: Tecnologia; lit: boolean }) {
  return (
    <li
      className={`flex items-center justify-center gap-3 rounded-[14px] border px-4 py-7 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        lit
          ? "border-accent-1/35 bg-white/[0.04] text-white-light"
          : "tecnologias-reveal border-white/[0.06] text-gray-300"
      }`}
    >
      {tech.logo ? (
        <Image
          src={tech.logo}
          alt=""
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 object-contain"
        />
      ) : null}
      <span className="text-[0.9375rem] font-medium tracking-[-0.01em] md:text-base">
        {tech.name}
      </span>
    </li>
  );
}

export function TecnologiasSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!grid) return;

    const bounds = grid.getBoundingClientRect();
    grid.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    grid.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  };

  const handlePointerLeave = () => {
    const grid = gridRef.current;
    if (!grid) return;

    grid.style.setProperty("--mouse-x", HIDDEN_SPOTLIGHT);
    grid.style.setProperty("--mouse-y", HIDDEN_SPOTLIGHT);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".tecnologias-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="tecnologias"
      ref={sectionRef}
      className="relative bg-background-deep py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="tecnologias-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {TECNOLOGIAS_TITLE.before}
            <span className="text-accent-1">{TECNOLOGIAS_TITLE.highlight}</span>
            {TECNOLOGIAS_TITLE.after}
          </h2>
          <p className="tecnologias-reveal max-w-[52ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {TECNOLOGIAS_SUBTITLE}
          </p>
        </header>

        <div
          ref={gridRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative mt-16"
        >
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:opacity-25">
            {TECNOLOGIAS.map((tech) => (
              <TechCell key={tech.name} tech={tech} lit={false} />
            ))}
          </ul>

          <ul
            aria-hidden="true"
            className="tech-spotlight-layer pointer-events-none absolute inset-0 hidden grid-cols-4 gap-3 lg:grid"
          >
            {TECNOLOGIAS.map((tech) => (
              <TechCell key={tech.name} tech={tech} lit />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
