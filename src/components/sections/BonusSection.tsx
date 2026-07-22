"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BonusCard } from "@/components/ui/BonusCard";
import { AULAS_BONUS, BONUS_SUBTITLE, BONUS_TITLE } from "@/data/bonus";

gsap.registerPlugin(ScrollTrigger);

export function BonusSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = viewport.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      viewport.scrollLeft = dragStartScroll + (dragStartX - event.clientX);
    };

    const stopDragging = () => {
      dragging = false;
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".bonus-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="bonus"
      ref={sectionRef}
      data-cursor="drag"
      className="relative bg-background-deep py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="bonus-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {BONUS_TITLE.before}
            <span className="text-accent-1">{BONUS_TITLE.highlight}</span>
            {BONUS_TITLE.after}
          </h2>
          <p className="bonus-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {BONUS_SUBTITLE}
          </p>
        </header>
      </div>

      <div
        ref={viewportRef}
        className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-6 px-6 pb-4 md:scroll-pl-10 md:px-10 lg:scroll-pl-[max(2.5rem,calc((100vw-1180px)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-1180px)/2+2.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AULAS_BONUS.map((aula, index) => (
          <BonusCard
            key={`${aula.specialist}-${aula.topic}`}
            aula={aula}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
