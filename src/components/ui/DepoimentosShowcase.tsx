"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Depoimento } from "@/data/alunos";

const MOVE_DUR = 0.55;

export function DepoimentosShowcase({ depoimentos }: { depoimentos: Depoimento[] }) {
  const total = depoimentos.length;
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, MOVE_DUR * 1000);
      setActive(((index % total) + total) % total);
    },
    [total],
  );

  const featured = depoimentos[active];
  const secondary = depoimentos.filter((_, index) => index !== active);

  if (prefersReducedMotion) {
    return (
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {depoimentos.map((depoimento) => (
          <figure
            key={depoimento.name}
            className="depoimento-card flex flex-col gap-6 p-7"
          >
            <blockquote className="text-[1rem] leading-relaxed text-gray-300">
              “{depoimento.quote}”
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <Image
                src={depoimento.photo}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <span className="flex flex-col">
                <span className="text-[0.9375rem] font-semibold text-white-light">
                  {depoimento.name}
                </span>
                <span className="text-sm text-gray-300">
                  {depoimento.role} · {depoimento.company}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-stretch">
        <figure
          key={featured.name}
          className="depoimento-featured relative flex flex-col justify-between gap-8 overflow-hidden p-9 md:p-11"
        >
          <Quote
            size={190}
            strokeWidth={1}
            aria-hidden="true"
            className="depoimento-quote-mark pointer-events-none absolute -right-6 -top-8 text-accent-1"
          />

          <blockquote className="relative text-[clamp(1.25rem,2.1vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.02em] text-white-light">
            “{featured.quote}”
          </blockquote>

          <figcaption className="relative flex items-center gap-4">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-accent-1/40">
              <Image
                src={featured.photo}
                alt=""
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white-light">
                {featured.name}
              </span>
              <span className="text-sm text-gray-300">
                {featured.role} · {featured.company}
              </span>
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-4">
          {secondary.map((depoimento) => {
            const index = depoimentos.indexOf(depoimento);

            return (
              <button
                key={depoimento.name}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ver depoimento de ${depoimento.name}`}
                className="depoimento-card flex flex-1 flex-col justify-between gap-5 p-6 text-left"
              >
                <blockquote className="line-clamp-4 text-[0.9375rem] leading-relaxed text-gray-300">
                  “{depoimento.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <Image
                    src={depoimento.photo}
                    alt=""
                    width={80}
                    height={80}
                    className="h-9 w-9 rounded-full object-cover grayscale"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-white-light">
                      {depoimento.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {depoimento.company}
                    </span>
                  </span>
                </figcaption>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Depoimento anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {depoimentos.map((depoimento, index) => (
            <button
              key={depoimento.name}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver depoimento de ${depoimento.name}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === active ? "w-7 bg-accent-1" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Próximo depoimento"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
