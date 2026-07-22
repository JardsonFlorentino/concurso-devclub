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
const TILT = 0.7;
const ROLL = -0.09;
const SCALE_MIN = 0.7;
const SCALE_RANGE = 0.36;
const SCALE_MAX = SCALE_MIN + SCALE_RANGE;
const OPACITY_MIN = 0.62;
const OPACITY_RANGE = 0.38;
const EXTENT_X = Math.cos(ROLL) + TILT * Math.abs(Math.sin(ROLL));
const EXTENT_Y = Math.abs(Math.sin(ROLL)) + TILT * Math.cos(ROLL);
const PAD = 6;
const MIN_GAP = 15;
const TILE_PCT = 0.09;
const TILE_MIN = 44;
const TILE_MAX = 88;
const INNER_TILE_RATIO = 0.6;
const HEIGHT_MAX = 700;
const NAME_TILE_MIN = 64;
const COMPACT_WIDTH = 640;
const REVOLUTION_OUTER = 64;
const REVOLUTION_INNER = 52;
const COMPACT_FACTOR = 0.42;
const HOVER_RATE = 0.1;
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
  tileOuter: number;
  tileInner: number;
  radiusOuter: number;
  radiusInner: number;
  capacityOuter: number;
  capacityInner: number;
  height: number;
  compact: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const capacityFor = (radius: number, tile: number) =>
  Math.max(
    0,
    Math.floor((ARC_LENGTH * radius) / (Math.SQRT2 * tile * SCALE_MAX + MIN_GAP)),
  );

function geometryFor(width: number): Geometry {
  const tileOuter = Math.round(clamp(width * TILE_PCT, TILE_MIN, TILE_MAX));
  const tileInner = Math.round(tileOuter * INNER_TILE_RATIO);
  const budget = (tileOuter * SCALE_MAX) / 2 + PAD;
  const maxHeight = clamp(width * 0.62, 300, HEIGHT_MAX);
  const radiusOuter = Math.max(
    0,
    Math.min((width / 2 - budget) / EXTENT_X, (maxHeight / 2 - budget) / EXTENT_Y),
  );
  const radiusInner = Math.max(
    0,
    radiusOuter -
      ((Math.SQRT1_2 * (tileOuter + tileInner) * SCALE_MAX + MIN_GAP) / TILT),
  );

  return {
    tileOuter,
    tileInner,
    radiusOuter,
    radiusInner,
    capacityOuter: capacityFor(radiusOuter, tileOuter),
    capacityInner: capacityFor(radiusInner, tileInner),
    height: Math.round(2 * (radiusOuter * EXTENT_Y + budget)),
    compact: width < COMPACT_WIDTH,
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
              tech.invert ? "logo-invert" : ""
            }`}
          />
        </span>
      ) : (
        <span
          style={{ fontSize: size * 0.135 }}
          className="tech-tile-inner flex flex-col items-center justify-center gap-[0.4em] px-[0.3em]"
        >
          <Icon
            size={size >= NAME_TILE_MIN ? "1.55em" : "2.4em"}
            strokeWidth={1.4}
            aria-hidden="true"
            className="text-accent-1/85"
          />
          {size >= NAME_TILE_MIN ? (
            <span className="max-w-full truncate text-[0.82em] font-medium leading-none tracking-[-0.01em] text-gray-300">
              {tech.name}
            </span>
          ) : null}
        </span>
      )}
    </span>
  );
}

export function TechOrbit({ tecnologias }: { tecnologias: Tecnologia[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const outerRefs = useRef<(HTMLElement | null)[]>([]);
  const innerRefs = useRef<(HTMLElement | null)[]>([]);
  const phaseRef = useRef({ outer: 0, inner: 0 });
  const hoverRef = useRef<string | null>(null);
  const rateRef = useRef(1);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
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

  const outerItems = useMemo(
    () =>
      tecnologias
        .filter((tech) => tech.ring === "outer")
        .slice(0, geometry.capacityOuter),
    [tecnologias, geometry.capacityOuter],
  );

  const innerItems = useMemo(
    () =>
      tecnologias
        .filter((tech) => tech.ring === "inner")
        .slice(0, geometry.capacityInner),
    [tecnologias, geometry.capacityInner],
  );

  const paint = useCallback(
    (outerPhase: number, innerPhase: number) => {
      const rings = [
        {
          key: "outer",
          nodes: outerRefs.current,
          total: outerItems.length,
          radius: geometry.radiusOuter,
          phase: outerPhase,
        },
        {
          key: "inner",
          nodes: innerRefs.current,
          total: innerItems.length,
          radius: geometry.radiusInner,
          phase: innerPhase,
        },
      ];

      for (const ring of rings) {
        for (let index = 0; index < ring.total; index++) {
          const element = ring.nodes[index];
          if (!element) continue;

          const angle = angleAt(index / ring.total + ring.phase);
          const x = ring.radius * Math.cos(angle);
          const y = ring.radius * TILT * Math.sin(angle);
          const depth = (Math.sin(angle) + 1) / 2;
          const scale = SCALE_MIN + SCALE_RANGE * depth;
          const isHovered = hoverRef.current === `${ring.key}:${index}`;

          element.style.transform = `translate(-50%, -50%) translate(${
            x * Math.cos(ROLL) - y * Math.sin(ROLL)
          }px, ${x * Math.sin(ROLL) + y * Math.cos(ROLL)}px) scale(${scale})`;
          element.style.opacity = isHovered
            ? "1"
            : `${OPACITY_MIN + OPACITY_RANGE * depth}`;
          element.style.zIndex = `${
            isHovered ? HOVER_Z : Math.round(depth * 100)
          }`;
        }
      }
    },
    [geometry, outerItems.length, innerItems.length],
  );

  const onHover = useCallback(
    (key: string | null) => {
      hoverRef.current = key;
      setHovered(key);
      paint(phaseRef.current.outer, phaseRef.current.inner);
    },
    [paint],
  );

  useEffect(() => {
    if (!geometry.radiusOuter) return;

    paint(phaseRef.current.outer, phaseRef.current.inner);
    if (!inView) return;

    const factor = geometry.compact ? COMPACT_FACTOR : 1;
    const outerSpeed = factor / REVOLUTION_OUTER;
    const innerSpeed = factor / REVOLUTION_INNER;
    let previous = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const delta = Math.min(now - previous, 64) / 1000;
      previous = now;

      const target = hoverRef.current === null ? 1 : HOVER_RATE;
      rateRef.current += (target - rateRef.current) * Math.min(delta * 7, 1);

      const phase = phaseRef.current;
      phase.outer = (phase.outer + delta * outerSpeed * rateRef.current) % 1;
      phase.inner = (phase.inner - delta * innerSpeed * rateRef.current + 1) % 1;
      paint(phase.outer, phase.inner);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [inView, paint, geometry.radiusOuter, geometry.compact]);

  const rings = [
    { key: "outer", items: outerItems, tile: geometry.tileOuter, refs: outerRefs },
    { key: "inner", items: innerItems, tile: geometry.tileInner, refs: innerRefs },
  ];

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
          style={{ opacity: geometry.radiusOuter ? 1 : 0 }}
        >
          {rings.map((ring) =>
            ring.items.map((tech, index) => (
              <span
                key={tech.name}
                ref={(node) => {
                  ring.refs.current[index] = node;
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    onHover(`${ring.key}:${index}`);
                  }
                }}
                onPointerLeave={() => onHover(null)}
                className="absolute left-1/2 top-1/2 block"
                style={{
                  width: ring.tile,
                  height: ring.tile,
                  willChange: "transform, opacity",
                }}
              >
                <TechTile
                  tech={tech}
                  size={ring.tile}
                  index={index}
                  active={hovered === `${ring.key}:${index}`}
                />
              </span>
            )),
          )}
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
