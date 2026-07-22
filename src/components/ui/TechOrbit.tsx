"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Atom,
  Blocks,
  Bot,
  Braces,
  Code2,
  Component,
  Container,
  Database,
  Droplet,
  FileCode2,
  Gauge,
  GitBranch,
  GitPullRequest,
  HardDrive,
  Layers,
  Link2,
  Palette,
  Rocket,
  Table2,
  Terminal,
  Wind,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useInView } from "@/hooks/useInView";
import type { Tecnologia } from "@/data/tecnologias";

const TAU = Math.PI * 2;
const TILT = 0.5;
const ROLL = -0.09;
const SCALE_MIN = 0.68;
const SCALE_RANGE = 0.52;
const SCALE_MAX = SCALE_MIN + SCALE_RANGE;
const OPACITY_MIN = 0.6;
const OPACITY_RANGE = 0.4;
const EXTENT_X = Math.cos(ROLL) + TILT * Math.abs(Math.sin(ROLL));
const EXTENT_Y = Math.abs(Math.sin(ROLL)) + TILT * Math.cos(ROLL);
const PAD = 6;
const SPACING_FACTOR = 1.42;
const MIN_ITEMS = 5;
const COMPACT_WIDTH = 640;
const REVOLUTION_DESKTOP = 54;
const REVOLUTION_COMPACT = 128;
const HOVER_RATE = 0.12;
const HOVER_Z = 400;
const ARC_STEPS = 512;

const ARC_TABLE = new Float64Array(ARC_STEPS + 1);
const ARC_LENGTH = (() => {
  let total = 0;
  for (let step = 1; step <= ARC_STEPS; step++) {
    const from = ((step - 1) / ARC_STEPS) * TAU;
    const to = (step / ARC_STEPS) * TAU;
    total += Math.hypot(
      Math.cos(to) - Math.cos(from),
      TILT * (Math.sin(to) - Math.sin(from)),
    );
    ARC_TABLE[step] = total;
  }
  for (let step = 0; step <= ARC_STEPS; step++) ARC_TABLE[step] /= total;
  return total;
})();

function angleAt(progress: number) {
  const target = progress - Math.floor(progress);
  let low = 1;
  let high = ARC_STEPS;

  while (low < high) {
    const middle = (low + high) >> 1;
    if (ARC_TABLE[middle] < target) low = middle + 1;
    else high = middle;
  }

  const before = ARC_TABLE[low - 1];
  const after = ARC_TABLE[low];
  const fraction = after > before ? (target - before) / (after - before) : 0;
  return ((low - 1 + fraction) / ARC_STEPS) * TAU;
}

const ICONS: Record<string, LucideIcon> = {
  HTML5: Code2,
  CSS3: Palette,
  JavaScript: Braces,
  TypeScript: FileCode2,
  React: Atom,
  "Node.js": Terminal,
  PostgreSQL: Database,
  Docker: Container,
  Git: GitBranch,
  GitHub: GitPullRequest,
  Python: Terminal,
  n8n: Workflow,
  OpenAI: Bot,
  LangChain: Link2,
  Pandas: Table2,
  "Next.js": Layers,
  "Tailwind CSS": Wind,
  Vite: Zap,
  Prisma: Blocks,
  "Drizzle ORM": Droplet,
  Express: Rocket,
  Fastify: Gauge,
  Redis: HardDrive,
};

interface Geometry {
  tile: number;
  radius: number;
  height: number;
  capacity: number;
  compact: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function geometryFor(width: number): Geometry {
  const compact = width < COMPACT_WIDTH;
  const tile = Math.round(clamp(width * 0.105, 50, 104));
  const budget = (tile * SCALE_MAX) / 2 + PAD;
  const maxHeight = clamp(width * 0.62, 300, 620);
  const radius = Math.max(
    0,
    Math.min((width / 2 - budget) / EXTENT_X, (maxHeight / 2 - budget) / EXTENT_Y),
  );

  return {
    tile,
    radius,
    compact,
    capacity: Math.max(
      MIN_ITEMS,
      Math.floor((ARC_LENGTH * radius) / (tile * SCALE_MAX * SPACING_FACTOR)),
    ),
    height: Math.round(2 * (radius * EXTENT_Y + budget)),
  };
}

function TechTile({
  tech,
  size,
  index,
  active,
}: {
  tech: Tecnologia;
  size: number;
  index: number;
  active: boolean;
}) {
  const Icon = ICONS[tech.name] ?? Component;

  return (
    <span
      data-active={active || undefined}
      style={{ "--tile-angle": `${(index * 47) % 360}deg` } as React.CSSProperties}
      className="tech-tile block h-full w-full"
    >
      {tech.logo ? (
        <span className="tech-tile-inner flex items-center justify-center p-[16%]">
          <Image
            src={tech.logo}
            alt=""
            width={96}
            height={96}
            unoptimized
            style={{ transform: `scale(${tech.scale ?? 1})` }}
            className={`h-full w-full object-contain ${
              tech.invert ? "tech-tile-invert" : ""
            }`}
          />
        </span>
      ) : (
        <span
          style={{ fontSize: size * 0.135 }}
          className="tech-tile-inner flex flex-col items-center justify-center gap-[0.5em] px-[0.4em]"
        >
          <Icon
            size="1.55em"
            strokeWidth={1.4}
            aria-hidden="true"
            className="text-accent-1/85"
          />
          <span className="max-w-full truncate text-[0.82em] font-medium leading-none tracking-[-0.01em] text-gray-300">
            {tech.name}
          </span>
        </span>
      )}
    </span>
  );
}

export function TechOrbit({ tecnologias }: { tecnologias: Tecnologia[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const phaseRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const rateRef = useRef(1);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
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

  const geometry = useMemo(() => geometryFor(width), [width]);
  const items = useMemo(
    () => tecnologias.slice(0, geometry.capacity),
    [tecnologias, geometry.capacity],
  );

  const paint = useCallback(
    (phase: number) => {
      const { radius } = geometry;
      const total = items.length;
      if (!total) return;

      for (let index = 0; index < total; index++) {
        const element = itemsRef.current[index];
        if (!element) continue;

        const angle = angleAt(index / total + phase);
        const x = radius * Math.cos(angle);
        const y = radius * TILT * Math.sin(angle);
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = SCALE_MIN + SCALE_RANGE * depth;
        const isHovered = hoverRef.current === index;

        element.style.transform = `translate(-50%, -50%) translate(${
          x * Math.cos(ROLL) - y * Math.sin(ROLL)
        }px, ${x * Math.sin(ROLL) + y * Math.cos(ROLL)}px) scale(${scale})`;
        element.style.opacity = isHovered
          ? "1"
          : `${OPACITY_MIN + OPACITY_RANGE * depth}`;
        element.style.zIndex = `${isHovered ? HOVER_Z : Math.round(depth * 100)}`;
      }
    },
    [geometry, items.length],
  );

  const onHover = useCallback(
    (index: number | null) => {
      hoverRef.current = index;
      setHovered(index);
      paint(phaseRef.current);
    },
    [paint],
  );

  useEffect(() => {
    if (!geometry.radius) return;

    paint(phaseRef.current);
    if (!inView) return;

    const speed =
      1 / (geometry.compact ? REVOLUTION_COMPACT : REVOLUTION_DESKTOP);
    let previous = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const delta = Math.min(now - previous, 64) / 1000;
      previous = now;
      const target = hoverRef.current === null ? 1 : HOVER_RATE;
      rateRef.current += (target - rateRef.current) * Math.min(delta * 7, 1);
      phaseRef.current =
        (phaseRef.current + delta * speed * rateRef.current) % 1;
      paint(phaseRef.current);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [inView, paint, geometry.radius, geometry.compact]);

  return (
    <div className="relative -mx-6 mt-14 md:mx-0 md:mt-16">
      <div
        ref={rootRef}
        aria-hidden="true"
        className="relative overflow-hidden"
        style={{ height: geometry.height }}
      >
        <span className="tech-orbit-glow pointer-events-none absolute inset-0" />

        <div
          className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: geometry.radius ? 1 : 0 }}
        >
          {items.map((tech, index) => (
            <span
              key={tech.name}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") onHover(index);
              }}
              onPointerLeave={() => onHover(null)}
              className="absolute left-1/2 top-1/2 block"
              style={{
                width: geometry.tile,
                height: geometry.tile,
                willChange: "transform, opacity",
              }}
            >
              <TechTile
                tech={tech}
                size={geometry.tile}
                index={index}
                active={hovered === index}
              />
            </span>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {tecnologias.map((tech) => (
          <li key={tech.name}>{tech.name}</li>
        ))}
      </ul>
    </div>
  );
}
