"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Tutor } from "@/data/tutores";

const MAX_VISIBLE = 2;
const SCALE_STEP = 0.14;
const TILT = 16;
const PERSPECTIVE = 1600;
const MOVE_DUR = 0.6;
const DRAG_THRESHOLD = 44;
const EASE = "cubic-bezier(0.16,1,0.3,1)";

interface Dims {
  cardW: number;
  cardH: number;
  spacing: number;
  depth: number;
}

function dimsFor(width: number): Dims {
  const cardW = Math.round(Math.min(300, Math.max(210, width * 0.64)));
  const cardH = Math.round(cardW * 1.3);
  return {
    cardW,
    cardH,
    spacing: Math.round(cardW * 0.62),
    depth: Math.round(cardW * 0.58),
  };
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function TutorPortrait({ tutor, index }: { tutor: Tutor; index: number }) {
  if (tutor.photo) {
    return (
      <Image
        src={tutor.photo}
        alt=""
        fill
        sizes="(max-width: 768px) 70vw, 300px"
        className="object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ "--tutor-angle": `${108 + index * 21}deg` } as React.CSSProperties}
      className={`tutor-portrait absolute inset-0 flex items-center justify-center ${
        tutor.tone === "accent-1"
          ? "tutor-portrait--accent-1"
          : "tutor-portrait--accent-2"
      }`}
    >
      <span className="text-[3.25rem] font-semibold tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.32)]">
        {initialsOf(tutor.name)}
      </span>
    </span>
  );
}

export function TutoresCoverflow({ tutores }: { tutores: Tutor[] }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const n = tutores.length;
  const [active, setActive] = useState(0);
  const [dims, setDims] = useState<Dims>({
    cardW: 280,
    cardH: 364,
    spacing: 174,
    depth: 162,
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const movedRef = useRef(false);
  const dragStartRef = useRef<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const apply = () => setDims(dimsFor(el.clientWidth));
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
    }, MOVE_DUR * 1000);
  }, []);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lock();
      setActive((current) => (((current + dir) % n) + n) % n);
    },
    [n, lock],
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
    dragStartRef.current = event.clientX;
    movedRef.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragStartRef.current === null) return;
    if (Math.abs(event.clientX - dragStartRef.current) > 8) movedRef.current = true;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (start === null) return;
    const delta = event.clientX - start;
    if (Math.abs(delta) > DRAG_THRESHOLD) step(delta < 0 ? 1 : -1);
  };

  if (prefersReducedMotion) {
    return (
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tutores.map((tutor, index) => (
          <div
            key={tutor.name}
            className="flex flex-col overflow-hidden rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <TutorPortrait tutor={tutor} index={index} />
            </div>
            <div className="flex flex-col gap-1 p-5">
              <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-white-light">
                {tutor.name}
              </h3>
              <span className="text-sm font-medium text-accent-1">
                {tutor.specialty}
              </span>
              <span className="text-sm text-gray-300">{tutor.role}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { cardW, cardH, spacing, depth } = dims;

  return (
    <div className="relative mt-8 lg:mt-12">
      <div
        ref={rootRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Tutores do DevClub"
        data-cursor="drag"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStartRef.current = null;
        }}
        className="relative flex touch-pan-y select-none items-center justify-center overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-accent-1/40"
        style={{ perspective: `${PERSPECTIVE}px`, height: cardH + 120 }}
      >
        <div
          className="relative"
          style={{
            width: cardW,
            height: cardH,
            transformStyle: "preserve-3d",
          }}
        >
          {tutores.map((tutor, index) => {
            let rel = index - active;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;

            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const scale = 1 - ax * SCALE_STEP;
            const translateX = rel * spacing;
            const translateZ = -ax * depth;
            const rotateY = -rel * TILT;

            return (
              <button
                type="button"
                key={tutor.name}
                onClick={() => {
                  if (movedRef.current) return;
                  goTo(index);
                }}
                aria-hidden={!visible}
                aria-label={`${tutor.name}, ${tutor.specialty}`}
                tabIndex={visible && !isActive ? 0 : -1}
                className="absolute left-1/2 top-1/2 block overflow-hidden rounded-[18px] border-[0.5px] border-white/10 text-left"
                style={{
                  width: cardW,
                  height: cardH,
                  transformStyle: "preserve-3d",
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transition: `transform ${MOVE_DUR}s ${EASE}, opacity ${MOVE_DUR}s ${EASE}, box-shadow ${MOVE_DUR}s ${EASE}`,
                  opacity: visible ? 1 : 0,
                  pointerEvents: visible ? "auto" : "none",
                  cursor: isActive ? "default" : "pointer",
                  backgroundColor: "var(--black-dark)",
                  boxShadow: isActive
                    ? "0 34px 90px -34px var(--accent-2)"
                    : "none",
                }}
              >
                <TutorPortrait tutor={tutor} index={index} />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 44%, color-mix(in srgb, var(--black-dark) 90%, transparent) 100%)",
                  }}
                />

                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5">
                  <span className="text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-white-light">
                    {tutor.name}
                  </span>
                  <span className="text-sm font-medium text-accent-1">
                    {tutor.specialty}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "var(--black-dark)",
                    opacity: isActive ? 0 : 0.55,
                    transition: `opacity ${MOVE_DUR}s ${EASE}`,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Tutor anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {tutores.map((tutor, index) => (
            <button
              key={tutor.name}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver ${tutor.name}`}
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
          aria-label="Próximo tutor"
          className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
