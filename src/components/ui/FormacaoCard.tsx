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
  Check,
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
const FOCUS_TILT_DEG = 1.2;

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
    const tilt = card.closest("[data-lane][data-focus]")
      ? FOCUS_TILT_DEG
      : MAX_TILT_DEG;

    gsap.to(card, {
      rotateY: gsap.utils.clamp(-1, 1, relativeX) * tilt,
      rotateX: gsap.utils.clamp(-1, 1, relativeY) * -tilt,
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
        {
          "--card-angle": `${112 + index * 19}deg`,
          ...(formacao.glow ? { "--glow": formacao.glow } : {}),
        } as React.CSSProperties
      }
      className="formacao-card group relative h-[480px] w-[300px] shrink-0 snap-start md:w-[340px]"
    >
      <div className="formacao-card-inner relative flex h-full flex-col overflow-hidden">
        <div className="card-spotlight pointer-events-none absolute inset-0 z-20" />

        <div className="relative z-10 flex h-full flex-col">
        <div className="relative flex h-[184px] shrink-0 items-center justify-center overflow-hidden border-b-[0.5px] border-white/[0.06]">
          <span className="card-visual-tint pointer-events-none absolute inset-0" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-4 select-none font-mono text-xs tracking-[-0.02em] text-white-light/30"
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className="card-glow pointer-events-none absolute h-[200px] w-[200px] rounded-full"
          />
          {formacao.logo ? (
            <Image
              src={formacao.logo}
              alt={formacao.name}
              width={180}
              height={180}
              unoptimized
              className={`card-media relative h-[80px] w-auto max-w-[160px] object-contain ${
                formacao.invert ? "logo-invert" : ""
              }`}
            />
          ) : (
            <Icon
              size={80}
              strokeWidth={1.2}
              aria-hidden="true"
              style={formacao.glow ? { color: formacao.glow } : undefined}
              className="card-media relative text-accent-1"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-white-light">
              {formacao.name}
            </h3>
            <p className="text-[0.875rem] leading-relaxed text-gray-300">
              {formacao.description}
            </p>
            <p className="flex items-start gap-2 text-[0.8125rem] leading-snug text-accent-1/90">
              <Check
                size={15}
                strokeWidth={2.25}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              {formacao.resultado}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-6">
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span>{formacao.nivel}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-gray-500"
              />
              <span>{formacao.cargaHoraria}</span>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {formacao.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border-[0.5px] border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-gray-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </article>
  );
}
