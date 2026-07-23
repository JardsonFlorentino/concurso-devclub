"use client";

import { useEffect } from "react";

type Hsl = { h: number; s: number; l: number };

const PROGRESS_STEPS = 240;
const FALLBACK_START: Hsl = { h: 133, s: 65, l: 53 };
const FALLBACK_END: Hsl = { h: 267, s: 89, l: 57 };

function toRgb(value: string): [number, number, number] | null {
  const input = value.trim();

  if (input.startsWith("#")) {
    const hex = input.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return null;
  }

  const parts = input.match(/-?\d*\.?\d+/g);
  if (!parts || parts.length < 3) return null;
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function toHsl(value: string, fallback: Hsl): Hsl {
  const rgb = toRgb(value);
  if (!rgb || rgb.some((channel) => Number.isNaN(channel))) return fallback;

  const [r, g, b] = rgb.map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l: l * 100 };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

function mix(start: Hsl, end: Hsl, progress: number): string {
  let arc = end.h - start.h;
  if (arc > 180) arc -= 360;
  if (arc < -180) arc += 360;

  const h = (start.h + arc * progress + 360) % 360;
  const s = start.s + (end.s - start.s) * progress;
  const l = start.l + (end.l - start.l) * progress;

  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

export function ScrollbarProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let start = FALLBACK_START;
    let end = FALLBACK_END;
    let lastStep = -1;
    let frame = 0;
    let queued = false;

    const readAccents = () => {
      const styles = getComputedStyle(root);
      start = toHsl(styles.getPropertyValue("--accent-1"), FALLBACK_START);
      end = toHsl(styles.getPropertyValue("--accent-2"), FALLBACK_END);
      lastStep = -1;
    };

    const update = () => {
      const distance = root.scrollHeight - window.innerHeight;
      const progress =
        distance > 0 ? Math.min(Math.max(window.scrollY / distance, 0), 1) : 0;
      const step = Math.round(progress * PROGRESS_STEPS);
      if (step === lastStep) return;

      lastStep = step;
      root.style.setProperty(
        "--scroll-thumb",
        mix(start, end, step / PROGRESS_STEPS),
      );
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };

    const onThemeChange = () => {
      readAccents();
      schedule();
    };

    readAccents();
    update();

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--scroll-thumb");
    };
  }, []);

  return null;
}
