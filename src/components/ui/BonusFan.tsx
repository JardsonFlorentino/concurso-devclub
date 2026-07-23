"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { AulaBonus } from "@/data/bonus";

const MOVE_DUR = 0.62;
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const PERSPECTIVE = 1500;
const DRAG_THRESHOLD = 48;
const COMPACT_WIDTH = 680;

interface Fan {
  cardW: number;
  cardH: number;
  reach: number;
  spacing: number;
  stepDeg: number;
  depth: number;
  arc: number;
}

function fanFor(width: number): Fan {
  const compact = width < COMPACT_WIDTH;
  const cardW = Math.round(Math.min(compact ? 250 : 310, Math.max(210, width * 0.62)));

  return {
    cardW,
    cardH: Math.round(cardW * 1.34),
    reach: compact ? 1 : 2,
    spacing: Math.round(cardW * (compact ? 0.46 : 0.56)),
    stepDeg: compact ? 6 : 9,
    depth: Math.round(cardW * 0.42),
    arc: Math.round(cardW * 0.06),
  };
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function CardFace({ aula, index }: { aula: AulaBonus; index: number }) {
  return (
    <>
      {aula.photo ? (
        <Image
          src={aula.photo}
          alt=""
          fill
          sizes="(max-width: 680px) 70vw, 310px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          style={{ "--tutor-angle": `${112 + index * 24}deg` } as React.CSSProperties}
          className={`tutor-portrait absolute inset-0 flex items-center justify-center ${
            aula.tone === "accent-1"
              ? "tutor-portrait--accent-1"
              : "tutor-portrait--accent-2"
          }`}
        >
          <span className="text-[3.5rem] font-semibold tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.32)]">
            {initialsOf(aula.specialist)}
          </span>
        </span>
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--black-dark) 42%, transparent) 0%, transparent 26%, transparent 44%, color-mix(in srgb, var(--black-dark) 92%, transparent) 100%)",
        }}
      />

      <span className="absolute right-3 top-3 rounded-[6px] bg-black-dark/85 px-2 py-1 text-[11px] font-medium tabular-nums leading-none text-white-light backdrop-blur-sm">
        {aula.duration}
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-1">
          {aula.specialist}
        </span>
        <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.015em] text-white-light">
          {aula.topic}
        </span>
      </span>
    </>
  );
}

export function BonusFan({ aulas }: { aulas: AulaBonus[] }) {
  const total = aulas.length;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const movedRef = useRef(false);
  const dragRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [fan, setFan] = useState<Fan>(() => fanFor(900));
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const apply = () => setFan(fanFor(element.clientWidth));
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, MOVE_DUR * 1000);
  }, []);

  const step = useCallback(
    (direction: number) => {
      if (lockRef.current) return;
      lock();
      setActive((current) => (((current + direction) % total) + total) % total);
    },
    [total, lock],
  );

  const goTo = useCallback(
    (index: number) => {
      if (lockRef.current || index === active) return;
      lock();
      setActive(index);
    },
    [active, lock],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    dragRef.current = event.clientX;
    movedRef.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragRef.current === null) return;
    if (Math.abs(event.clientX - dragRef.current) > 8) movedRef.current = true;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = dragRef.current;
    dragRef.current = null;
    if (start === null) return;
    const delta = event.clientX - start;
    if (Math.abs(delta) > DRAG_THRESHOLD) step(delta < 0 ? 1 : -1);
  };

  if (prefersReducedMotion) {
    return (
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {aulas.map((aula, index) => (
          <article key={aula.topic} className="bonus-fan-card">
            <div
              className="bonus-fan-inner relative overflow-hidden"
              style={{ aspectRatio: "3 / 4" }}
            >
              <CardFace aula={aula} index={index} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  const { cardW, cardH, reach, spacing, stepDeg, depth, arc } = fan;

  return (
    <div className="relative mt-10 lg:mt-14">
      <div
        ref={rootRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Módulos bônus"
        data-cursor="drag"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
        className="relative flex touch-pan-y select-none items-center justify-center overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-accent-1/40"
        style={{ perspective: `${PERSPECTIVE}px`, height: cardH + 132 }}
      >
        <div
          className="relative"
          style={{ width: cardW, height: cardH, transformStyle: "preserve-3d" }}
        >
          {aulas.map((aula, index) => {
            let offset = index - active;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const distance = Math.abs(offset);
            const visible = distance <= reach;
            const isActive = offset === 0;

            return (
              <article
                key={aula.topic}
                data-active={isActive || undefined}
                aria-hidden={!visible}
                className="bonus-fan-card absolute left-1/2 top-1/2"
                style={{
                  width: cardW,
                  height: cardH,
                  transform: `translate(-50%, -50%) translateX(${
                    offset * spacing
                  }px) translateY(${distance * arc - (isActive ? 18 : 0)}px) translateZ(${
                    -distance * depth
                  }px) rotateZ(${offset * stepDeg}deg) scale(${
                    isActive ? 1.04 : 0.93
                  })`,
                  transition: `transform ${MOVE_DUR}s ${EASE}, opacity ${MOVE_DUR}s ${EASE}, background ${MOVE_DUR}s ${EASE}, box-shadow ${MOVE_DUR}s ${EASE}`,
                  opacity: visible ? 1 : 0,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: 100 - distance,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (movedRef.current) return;
                    goTo(index);
                  }}
                  tabIndex={visible && !isActive ? 0 : -1}
                  aria-label={`${aula.topic}, com ${aula.specialist}`}
                  style={{ cursor: isActive ? "default" : "pointer" }}
                  className="bonus-fan-inner relative block h-full w-full overflow-hidden text-left"
                >
                  <CardFace aula={aula} index={index} />

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-black-dark transition-opacity duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ opacity: isActive ? 0 : 0.32 }}
                  />
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Módulo anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {aulas.map((aula, index) => (
            <button
              key={aula.topic}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver ${aula.topic}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === active
                  ? "w-6 bg-accent-1"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Próximo módulo"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
