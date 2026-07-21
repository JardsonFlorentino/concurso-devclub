"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import {
  ALUNOS,
  ALUNOS_SUBTITLE,
  ALUNOS_TITLE,
  DEPOIMENTOS,
} from "@/data/alunos";

gsap.registerPlugin(ScrollTrigger);

const FOLLOW_LERP = 0.12;
const PHOTO_OFFSET_X = 36;
const PHOTO_OFFSET_Y = -110;

export function AlunosSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const followerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  const followerEnabled = finePointer && !prefersReducedMotion;

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower || !followerEnabled) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...pointer };
    let frame = 0;

    const render = () => {
      current.x += (pointer.x - current.x) * FOLLOW_LERP;
      current.y += (pointer.y - current.y) * FOLLOW_LERP;
      follower.style.transform = `translate3d(${current.x + PHOTO_OFFSET_X}px, ${
        current.y + PHOTO_OFFSET_Y
      }px, 0)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [followerEnabled]);

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
      id="alunos"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--a1" />
        <div className="aurora-blob aurora-blob--a2" />
        <div className="absolute inset-0 bg-black-dark/45" />
      </div>

      {followerEnabled && (
        <div
          ref={followerRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 h-[260px] w-[200px]"
        >
          {ALUNOS.map((aluno, index) => (
            <Image
              key={aluno.name}
              src={aluno.photo}
              alt=""
              width={200}
              height={260}
              className={`absolute inset-0 h-full w-full rounded-[14px] object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeIndex === index
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header className="flex max-w-[24ch] flex-col gap-4">
          <h2 className="alunos-reveal text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-white-light">
            {ALUNOS_TITLE.before}
            <span className="text-accent-1">{ALUNOS_TITLE.highlight}</span>
            {ALUNOS_TITLE.after}
          </h2>
          <p className="alunos-reveal hidden text-[0.9375rem] leading-relaxed text-gray-300 lg:block">
            {ALUNOS_SUBTITLE}
          </p>
        </header>

        <ul
          onPointerLeave={() => setActiveIndex(null)}
          className="mt-16 flex flex-col border-t border-white/10"
        >
          {ALUNOS.map((aluno, index) => (
            <li
              key={aluno.name}
              onPointerEnter={() => setActiveIndex(index)}
              data-cursor="hover"
              className={`alunos-reveal group flex cursor-default flex-col gap-4 border-b border-white/10 py-8 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:flex-row md:items-center md:justify-between md:gap-10 md:py-10 ${
                activeIndex !== null && activeIndex !== index
                  ? "lg:opacity-35"
                  : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-5">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full lg:hidden">
                  <Image
                    src={aluno.photo}
                    alt={aluno.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </span>
                <h3
                  className={`text-[clamp(1.75rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeIndex === index
                      ? "text-accent-1"
                      : "text-white-light lg:group-hover:text-accent-1"
                  }`}
                >
                  {aluno.name}
                </h3>
              </div>

              <div className="flex shrink-0 flex-col gap-1 md:items-end">
                <span className="text-[0.9375rem] text-gray-300">{aluno.role}</span>
                <span className="text-sm text-gray-500">{aluno.location}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-24 grid gap-5 md:grid-cols-3">
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
