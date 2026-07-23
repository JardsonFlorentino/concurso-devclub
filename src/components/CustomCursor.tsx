"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

type CursorState = "default" | "hover" | "drag" | "expand" | "accent";

const RING_LERP = 0.2;
const DOT_LERP = 0.72;
const PRESS_SCALE = 0.78;
const PRESS_LERP = 0.3;
const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select";
const ACCENT_SELECTOR = "[data-cursor='accent']";

const RING_STYLES: Record<CursorState, string> = {
  default: "h-7 w-7 border-white-light/55",
  hover: "h-12 w-12 border-white-light/85 bg-white-light/15",
  drag: "h-auto w-auto border-white-light bg-white-light px-4 py-2.5",
  expand: "h-12 w-12 border-white-light/15 bg-white-light/10",
  accent: "h-14 w-14 border-accent-1 bg-accent-1/25",
};

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<CursorState>("default");
  const [state, setState] = useState<CursorState>("default");
  const finePointer = useFinePointer();

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...pointer };
    const dot = { ...pointer };
    const press = { current: 1, target: 1 };
    let frame = 0;

    const apply = (next: CursorState) => {
      if (stateRef.current === next) return;
      stateRef.current = next;
      setState(next);
    };

    const render = () => {
      ring.x += (pointer.x - ring.x) * RING_LERP;
      ring.y += (pointer.y - ring.y) * RING_LERP;
      dot.x += (pointer.x - dot.x) * DOT_LERP;
      dot.y += (pointer.y - dot.y) * DOT_LERP;
      press.current += (press.target - press.current) * PRESS_LERP;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${press.current})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

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

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      apply(resolve(event.target));
    };

    const onPointerDown = () => {
      press.target = PRESS_SCALE;
    };

    const onPointerUp = () => {
      press.target = 1;
    };

    const onLeave = () => {
      press.target = 1;
      apply("default");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] ${
        state === "accent" ? "" : "mix-blend-difference"
      }`}
    >
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,padding,background-color,border-color] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${RING_STYLES[state]}`}
      >
        {state === "drag" && (
          <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-black-dark">
            Arraste →
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className={`absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-white-light transition-opacity duration-300 ${
          state === "default" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
