"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

type CursorState = "default" | "hover" | "drag" | "expand";

const RING_LERP = 0.16;
const DOT_LERP = 0.55;
const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select";

const RING_STYLES: Record<CursorState, string> = {
  default: "h-8 w-8 border-white-light/70",
  hover: "h-14 w-14 border-white-light",
  drag: "h-auto w-auto border-white-light bg-white-light px-4 py-2.5",
  expand: "h-28 w-28 border-white-light/40 bg-white-light/25",
};

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CursorState>("default");
  const finePointer = useFinePointer();

  useEffect(() => {
    if (!finePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...pointer };
    const dot = { ...pointer };
    let frame = 0;

    const render = () => {
      ring.x += (pointer.x - ring.x) * RING_LERP;
      ring.y += (pointer.y - ring.y) * RING_LERP;
      dot.x += (pointer.x - dot.x) * DOT_LERP;
      dot.y += (pointer.y - dot.y) * DOT_LERP;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
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

      const element = event.target as Element | null;
      if (!element || typeof element.closest !== "function") return;

      if (element.closest(INTERACTIVE_SELECTOR)) {
        setState("hover");
        return;
      }

      const zone = element.closest<HTMLElement>("[data-cursor]");
      setState((zone?.dataset.cursor as CursorState | undefined) ?? "default");
    };

    const onPointerLeaveWindow = () => setState("default");

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeaveWindow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeaveWindow);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [finePointer]);

  if (!finePointer) return null;

  const dotHidden = state !== "default";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,padding,background-color,border-color,opacity] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${RING_STYLES[state]}`}
      >
        {state === "drag" && (
          <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-black-dark">
            Arraste →
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className={`absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white-light transition-opacity duration-200 ${
          dotHidden ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
