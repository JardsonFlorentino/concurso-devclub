"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { AulaBonus } from "@/data/bonus";

const MAX_TILT_DEG = 3;

export function BonusCard({ aula, index }: { aula: AulaBonus; index: number }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const bounds = card.getBoundingClientRect();
    const relativeX =
      (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
    const relativeY =
      (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);

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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--card-angle": `${118 + index * 23}deg` } as React.CSSProperties}
      className="bonus-reveal bonus-card group w-[280px] shrink-0 snap-start md:w-[320px]"
    >
      <div className="bonus-card-inner relative flex h-full flex-col overflow-hidden">
        <div className="relative h-[168px] shrink-0 overflow-hidden">
          {aula.image ? (
            <Image
              src={aula.image}
              alt=""
              fill
              sizes="320px"
              className="projeto-media object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`projeto-media absolute inset-0 ${
                aula.tone === "accent-1"
                  ? "projeto-media--accent-1"
                  : "projeto-media--accent-2"
              }`}
            />
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 48%, color-mix(in srgb, var(--black-dark) 78%, transparent) 100%)",
            }}
          />

          <span
            aria-hidden="true"
            className="bonus-play absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          >
            <span className="bonus-play-inner flex h-full w-full items-center justify-center rounded-full">
              <Play
                size={18}
                strokeWidth={1.75}
                fill="currentColor"
                className="ml-0.5 text-white-light"
              />
            </span>
          </span>

          <span className="absolute bottom-3 right-3 rounded-[6px] bg-black-dark/85 px-2 py-1 text-[11px] font-medium tabular-nums leading-none text-white-light backdrop-blur-sm">
            {aula.duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent-1">
            {aula.specialist}
          </span>
          <h3 className="text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] text-white-light">
            {aula.topic}
          </h3>
        </div>

        <span
          aria-hidden="true"
          className="bonus-progress absolute inset-x-0 bottom-0 h-[2px] origin-left"
        />
      </div>
    </article>
  );
}
