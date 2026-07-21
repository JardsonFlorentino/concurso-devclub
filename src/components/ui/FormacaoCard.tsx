"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  Atom,
  BarChart3,
  Bot,
  Braces,
  BrainCircuit,
  FileCode2,
  Hexagon,
  Layers,
  Layout,
  Palette,
  PieChart,
  Server,
  Smartphone,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Formacao, FormacaoIcon } from "@/data/formacoes";

const ICONS: Record<FormacaoIcon, LucideIcon> = {
  Layout,
  Server,
  Layers,
  Smartphone,
  Atom,
  Hexagon,
  Braces,
  FileCode2,
  Palette,
  BrainCircuit,
  Bot,
  Terminal,
  Workflow,
  BarChart3,
  PieChart,
};

const MAX_TILT_DEG = 3;

interface FormacaoCardProps {
  formacao: Formacao;
  index: number;
}

export function FormacaoCard({ formacao, index }: FormacaoCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = ICONS[formacao.icon];
  const label = String(index + 1).padStart(2, "0");

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;

    card.style.setProperty("--mouse-x", `${offsetX}px`);
    card.style.setProperty("--mouse-y", `${offsetY}px`);

    const relativeX = (offsetX - bounds.width / 2) / (bounds.width / 2);
    const relativeY = (offsetY - bounds.height / 2) / (bounds.height / 2);

    gsap.to(card, {
      rotateY: gsap.utils.clamp(-1, 1, relativeX) * MAX_TILT_DEG,
      rotateX: gsap.utils.clamp(-1, 1, relativeY) * -MAX_TILT_DEG,
      y: -8,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 900,
    });
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={cardRef}
      data-card
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        formacao.glow ? ({ "--glow": formacao.glow } as React.CSSProperties) : undefined
      }
      className="group relative h-[380px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.04] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-2/55 hover:bg-white/[0.06] hover:shadow-[0_22px_70px_-28px_var(--accent-2)] md:w-[340px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-9 select-none text-[9rem] font-bold leading-none tracking-[-0.06em] text-white-light opacity-[0.05]"
      >
        {label}
      </span>

      <div className="card-spotlight pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col p-7">
        <div className="relative flex h-[150px] shrink-0 items-center justify-center">
          <span
            aria-hidden="true"
            className="card-glow pointer-events-none absolute h-[180px] w-[180px] rounded-full"
          />
          {formacao.logo ? (
            <Image
              src={formacao.logo}
              alt={formacao.name}
              width={160}
              height={160}
              unoptimized
              className="card-media relative h-[72px] w-auto max-w-[150px] object-contain"
            />
          ) : (
            <Icon
              size={64}
              strokeWidth={1.25}
              aria-hidden="true"
              style={formacao.glow ? { color: formacao.glow } : undefined}
              className="card-media relative text-accent-1"
            />
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2.5">
          <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-white-light">
            {formacao.name}
          </h3>
          <p className="text-[0.9375rem] leading-relaxed text-gray-300">
            {formacao.description}
          </p>
        </div>
      </div>
    </article>
  );
}
