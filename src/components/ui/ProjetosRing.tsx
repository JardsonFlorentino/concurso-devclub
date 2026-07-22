"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { ProjetoMockup } from "@/components/ui/ProjetoMockup";
import type { Projeto } from "@/data/projetos";

const PERSPECTIVE = 2000;
const TILT = -8;
const SPACING = 1.42;
const REVOLUTION = 46;
const DRAG_GAIN = 0.28;
const FRICTION = 0.94;
const REST_VELOCITY = 0.02;
const HOVER_RATE = 0;
const CAPTION_EASE = "cubic-bezier(0.16,1,0.3,1)";

interface Geometry {
  cardW: number;
  cardH: number;
  radius: number;
  height: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function geometryFor(width: number, count: number): Geometry {
  const cardW = Math.round(clamp(width * 0.44, 224, 344));
  const cardH = Math.round(cardW * 0.66);
  const radius = (cardW * SPACING) / (2 * Math.tan(Math.PI / count));

  return { cardW, cardH, radius, height: Math.round(cardH + 132) };
}

export function ProjetosRing({ projetos }: { projetos: Projeto[] }) {
  const count = projetos.length;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const rateRef = useRef(1);
  const hoverRef = useRef(false);
  const dragRef = useRef({ active: false, x: 0, moved: false });
  const [width, setWidth] = useState(0);
  const [front, setFront] = useState(0);
  const inView = useInView(rootRef, { rootMargin: "120px" });

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const apply = () => setWidth(element.clientWidth);
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(
    () => geometryFor(width, count),
    [width, count],
  );
  const step = 360 / count;

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !width) return;

    const draw = () => {
      ring.style.transform = `translateZ(${-geometry.radius}px) rotateY(${rotationRef.current}deg)`;
      const index =
        ((Math.round(-rotationRef.current / step) % count) + count) % count;
      setFront((current) => (current === index ? current : index));
    };

    draw();
    if (!inView) return;

    const speed = 360 / REVOLUTION;
    let previous = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const delta = Math.min(now - previous, 64) / 1000;
      previous = now;

      if (!dragRef.current.active) {
        if (Math.abs(velocityRef.current) > REST_VELOCITY) {
          rotationRef.current += velocityRef.current * delta;
          velocityRef.current *= Math.pow(FRICTION, delta * 60);
        } else {
          const target = hoverRef.current ? HOVER_RATE : 1;
          rateRef.current += (target - rateRef.current) * Math.min(delta * 6, 1);
          rotationRef.current += speed * rateRef.current * delta;
        }
        draw();
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [inView, width, geometry.radius, step, count]);

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { active: true, x: event.clientX, moved: false };
    velocityRef.current = 0;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const deltaX = event.clientX - drag.x;
    drag.x = event.clientX;
    if (Math.abs(deltaX) > 1) drag.moved = true;

    rotationRef.current += deltaX * DRAG_GAIN;
    velocityRef.current = deltaX * DRAG_GAIN * 60;

    const ring = ringRef.current;
    if (ring) {
      ring.style.transform = `translateZ(${-geometry.radius}px) rotateY(${rotationRef.current}deg)`;
      const index =
        ((Math.round(-rotationRef.current / step) % count) + count) % count;
      setFront((current) => (current === index ? current : index));
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current.active = false;
  };

  const active = projetos[front];

  return (
    <div className="mt-12 lg:mt-14">
      <div
        ref={rootRef}
        aria-hidden="true"
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => {
          hoverRef.current = true;
        }}
        onPointerLeave={() => {
          hoverRef.current = false;
          dragRef.current.active = false;
        }}
        className="relative flex touch-pan-y select-none items-center justify-center overflow-hidden"
        style={{ perspective: `${PERSPECTIVE}px`, height: geometry.height }}
      >
        <div
          className="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${TILT}deg)`,
            opacity: width ? 1 : 0,
          }}
        >
          <div
            ref={ringRef}
            className="relative"
            style={{
              width: geometry.cardW,
              height: geometry.cardH,
              transformStyle: "preserve-3d",
            }}
          >
            {projetos.map((projeto, index) => (
              <div
                key={projeto.name}
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${index * step}deg) translateZ(${geometry.radius}px)`,
                }}
              >
                <div
                  data-front={index === front || undefined}
                  className="projeto-card absolute inset-0"
                >
                  <div className="projeto-card-inner relative h-full w-full overflow-hidden">
                    {projeto.image ? (
                      <Image
                        src={projeto.image}
                        alt=""
                        fill
                        sizes="344px"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <span
                          className={`absolute inset-0 ${
                            projeto.tone === "accent-1"
                              ? "projeto-media--accent-1"
                              : "projeto-media--accent-2"
                          }`}
                        />
                        <ProjetoMockup projeto={projeto} />
                      </>
                    )}
                  </div>
                </div>

                <div className="projeto-card projeto-card--back absolute inset-0">
                  <div
                    className={`projeto-card-inner h-full w-full ${
                      projeto.tone === "accent-1"
                        ? "projeto-media--accent-1"
                        : "projeto-media--accent-2"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        key={active.name}
        style={{ animation: `projeto-caption 0.5s ${CAPTION_EASE} both` }}
        className="mt-2 flex flex-col items-center gap-3 text-center lg:mt-4"
      >
        <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-white-light">
          {active.name}
        </h3>
        <p className="max-w-[46ch] text-sm leading-relaxed text-gray-300">
          {active.description}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {active.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border-[0.5px] border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <ul className="sr-only">
        {projetos.map((projeto) => (
          <li key={projeto.name}>
            {projeto.name}. {projeto.description} {projeto.stack.join(", ")}.
          </li>
        ))}
      </ul>
    </div>
  );
}
