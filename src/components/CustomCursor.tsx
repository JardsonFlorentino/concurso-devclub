"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

type CursorState = "default" | "hover" | "drag" | "expand" | "accent";

const RING_LERP = 0.2;
const DOT_LERP = 0.72;
const PRESS_SCALE = 0.76;
const PRESS_OVERSHOOT = 1.12;
const PRESS_LERP = 0.3;
const OVERSHOOT_MS = 130;
const STRETCH_MAX = 0.34;
const STRETCH_SPEED = 42;
const STRETCH_LERP = 0.16;
const GAIN_LERP = 0.14;
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select";
const ACCENT_SELECTOR = "[data-cursor='accent']";
const STRETCH_STATES = new Set<CursorState>(["default", "expand"]);

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const stretchRef = useRef<HTMLSpanElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const finePointer = useFinePointer();

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...pointer };
    const dot = { ...pointer };
    const press = { current: 1, target: 1 };
    const stretch = { current: 0, target: 0 };
    const gain = { current: 1, target: 1 };
    let state: CursorState = "default";
    let angle = 0;
    let overshoot = 0;
    let frame = 0;
    let needsResolve = false;

    const resolve = (target: EventTarget | null): CursorState => {
      const element = target as Element | null;
      if (!element || typeof element.closest !== "function") return "default";

      const zone = element.closest<HTMLElement>("[data-cursor]");
      const zoneState = zone?.dataset.cursor as CursorState | undefined;
      if (zoneState === "drag") return "drag";
      if (element.closest(ACCENT_SELECTOR)) return "accent";
      if (element.closest(INTERACTIVE_SELECTOR)) return "hover";
      return zoneState ?? "default";
    };

    const apply = (next: CursorState) => {
      if (state === next) return;
      state = next;
      if (rootRef.current) rootRef.current.dataset.state = next;
    };

    const setHidden = (hidden: boolean) => {
      const root = rootRef.current;
      if (!root) return;
      if (hidden) root.dataset.hidden = "true";
      else delete root.dataset.hidden;
    };

    const render = () => {
      if (needsResolve) {
        needsResolve = false;
        apply(resolve(document.elementFromPoint(pointer.x, pointer.y)));
      }

      const travelX = pointer.x - ring.x;
      const travelY = pointer.y - ring.y;
      const speed = Math.hypot(travelX, travelY);

      if (speed > 1) angle = (Math.atan2(travelY, travelX) * 180) / Math.PI;
      stretch.target = Math.min(speed / STRETCH_SPEED, 1) * STRETCH_MAX;
      stretch.current += (stretch.target - stretch.current) * STRETCH_LERP;

      gain.target = STRETCH_STATES.has(state) ? 1 : 0;
      gain.current += (gain.target - gain.current) * GAIN_LERP;

      ring.x += travelX * RING_LERP;
      ring.y += travelY * RING_LERP;
      dot.x += (pointer.x - dot.x) * DOT_LERP;
      dot.y += (pointer.y - dot.y) * DOT_LERP;
      press.current += (press.target - press.current) * PRESS_LERP;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${press.current})`;
      }
      if (stretchRef.current) {
        const amount = stretch.current * gain.current;
        stretchRef.current.style.transform = `rotate(${angle}deg) scale(${1 + amount}, ${1 - amount * 0.62})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setHidden(false);
      apply(resolve(event.target));
    };

    const onPointerDown = () => {
      press.target = PRESS_SCALE;
    };

    const onPointerUp = () => {
      press.target = PRESS_OVERSHOOT;
      window.clearTimeout(overshoot);
      overshoot = window.setTimeout(() => {
        press.target = 1;
      }, OVERSHOOT_MS);
    };

    const onScroll = () => {
      needsResolve = true;
    };

    const onLeave = () => {
      window.clearTimeout(overshoot);
      press.target = 1;
      stretch.target = 0;
      apply("default");
      setHidden(true);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) onLeave();
    };

    const onVisibilityChange = () => {
      if (document.hidden) onLeave();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(overshoot);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor-layer" data-state="default">
      <div ref={ringRef} className="cursor-ring">
        <span ref={stretchRef} className="cursor-ring-stretch">
          <span className="cursor-ring-border" />
        </span>
        <span className="cursor-ring-arrows">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18 9 12l6-6" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
