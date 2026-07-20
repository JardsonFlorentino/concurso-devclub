"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AREA_PER_PARTICLE = 9000;
const MIN_PARTICLES = 180;
const MAX_PARTICLES = 420;
const ACCENT_RATIO = 0.06;
const REPULSION_RADIUS = 150;
const REPULSION_STRENGTH = 2.6;
const RETURN_LERP = 0.022;

interface DustParticle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  driftX: number;
  driftY: number;
  alpha: number;
  useAccent: boolean;
}

export function DustField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const particles: DustParticle[] = [];
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let frame = 0;

    let accentColor = "#39d353";
    const readAccent = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-1")
        .trim();
      if (value) accentColor = value;
    };
    readAccent();

    const themeObserver = new MutationObserver(readAccent);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const seed = () => {
      const count = Math.min(
        MAX_PARTICLES,
        Math.max(MIN_PARTICLES, Math.round((width * height) / AREA_PER_PARTICLE)),
      );
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          baseX: x,
          baseY: y,
          x,
          y,
          radius: 0.35 + Math.random() * 1.5,
          driftX: (Math.random() - 0.5) * 0.16,
          driftY: -0.05 - Math.random() * 0.12,
          alpha: 0.05 + Math.random() * 0.18,
          useAccent: Math.random() < ACCENT_RATIO,
        });
      }
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.useAccent ? accentColor : "#f5f5f7";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const advance = () => {
      for (const particle of particles) {
        particle.baseX += particle.driftX;
        particle.baseY += particle.driftY;

        if (particle.baseY < -8) {
          particle.baseY = height + 8;
          particle.baseX = Math.random() * width;
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        }
        if (particle.baseX < -8) {
          particle.baseX = width + 8;
          particle.x = particle.baseX;
        }
        if (particle.baseX > width + 8) {
          particle.baseX = -8;
          particle.x = particle.baseX;
        }

        const deltaX = particle.x - pointer.x;
        const deltaY = particle.y - pointer.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (distanceSquared < REPULSION_RADIUS * REPULSION_RADIUS) {
          const distance = Math.sqrt(distanceSquared) || 1;
          const force = (1 - distance / REPULSION_RADIUS) * REPULSION_STRENGTH;
          particle.x += (deltaX / distance) * force;
          particle.y += (deltaY / distance) * force;
        }

        particle.x += (particle.baseX - particle.x) * RETURN_LERP;
        particle.y += (particle.baseY - particle.y) * RETURN_LERP;
      }
    };

    const loop = () => {
      advance();
      paint();
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const clearPointer = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    seed();

    if (prefersReducedMotion) {
      paint();
    } else {
      frame = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", clearPointer);
    }

    const onResize = () => {
      resize();
      seed();
      if (prefersReducedMotion) paint();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", clearPointer);
      themeObserver.disconnect();
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
