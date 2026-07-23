"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  MERCADO_NIVEIS,
  MERCADO_SERIES,
  type NivelSalarial,
} from "@/data/mercado";

const COUNT_DURATION = 0.9;
const MAX_VALOR = Math.max(
  ...MERCADO_NIVEIS.flatMap((nivel) => [nivel.brasil, nivel.internacional]),
);

const formatBRL = (value: number) => `R$ ${Math.round(value / 1000)} mil`;

function useCountTo(target: number, enabled: boolean) {
  const [value, setValue] = useState<number | null>(null);
  const holder = useRef({ value: 0 });

  useEffect(() => {
    if (!enabled) return;

    const tween = gsap.to(holder.current, {
      value: target,
      duration: COUNT_DURATION,
      ease: "power3.out",
      onUpdate: () => setValue(holder.current.value),
    });

    return () => {
      tween.kill();
    };
  }, [target, enabled]);

  return enabled && value !== null ? value : target;
}

function Barra({
  label,
  value,
  target,
  tone,
}: {
  label: string;
  value: number;
  target: number;
  tone: "accent-1" | "accent-2";
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[92px] shrink-0 text-sm text-gray-300 md:w-[124px]">
        {label}
      </span>

      <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <span
          style={{ width: `${(target / MAX_VALOR) * 100}%` }}
          className={`mercado-bar absolute inset-y-0 left-0 rounded-full ${
            tone === "accent-1" ? "bg-accent-1" : "bg-accent-2"
          }`}
        />
      </div>

      <span className="w-[88px] shrink-0 text-right text-sm font-medium tabular-nums text-white-light md:w-[100px] md:text-[0.9375rem]">
        {formatBRL(value)}
      </span>
    </div>
  );
}

export function MercadoComparador() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const inView = useInView(rootRef, { rootMargin: "-80px", once: true });

  const animated = inView && !prefersReducedMotion;
  const nivel: NivelSalarial = MERCADO_NIVEIS[active];
  const brasil = useCountTo(nivel.brasil, animated);
  const internacional = useCountTo(nivel.internacional, animated);
  const diferenca = Math.round(
    (nivel.internacional / nivel.brasil - 1) * 100,
  );

  const select = useCallback((index: number) => setActive(index), []);

  return (
    <div ref={rootRef} className="mercado-reveal mt-12 flex flex-col gap-10">
      <div
        role="tablist"
        aria-label="Senioridade"
        className="flex w-max max-w-full gap-1 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm"
      >
        {MERCADO_NIVEIS.map((item, index) => (
          <button
            key={item.level}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => select(index)}
            className={`rounded-full px-5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-7 ${
              index === active
                ? "mercado-tab-active text-accent-1"
                : "text-gray-400 hover:text-white-light"
            }`}
          >
            {item.level}
          </button>
        ))}
      </div>

      <div className="flex max-w-[860px] flex-col gap-4">
        <Barra
          label={MERCADO_SERIES.brasil}
          value={brasil}
          target={nivel.brasil}
          tone="accent-1"
        />
        <Barra
          label={MERCADO_SERIES.internacional}
          value={internacional}
          target={nivel.internacional}
          tone="accent-2"
        />
      </div>

      <div
        key={nivel.level}
        className="mercado-delta flex w-max max-w-full items-center gap-3 rounded-[12px] border-[0.5px] border-accent-1/35 bg-accent-1/[0.08] px-5 py-3"
      >
        <span className="text-[1.375rem] font-semibold tabular-nums tracking-[-0.02em] text-accent-1">
          +{diferenca}%
        </span>
        <span className="text-sm leading-snug text-gray-300">
          no exterior para {nivel.level.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
