"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { TUTORES, TUTORES_SUBTITLE, TUTORES_TITLE } from "@/data/tutores";

gsap.registerPlugin(ScrollTrigger);

const TAG_LERP = 0.14;
const TAG_OFFSET_X = 22;
const TAG_OFFSET_Y = 18;

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function TutoresSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  const tagEnabled = finePointer && !prefersReducedMotion;

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag || !tagEnabled) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...pointer };
    let frame = 0;

    const render = () => {
      current.x += (pointer.x - current.x) * TAG_LERP;
      current.y += (pointer.y - current.y) * TAG_LERP;
      tag.style.transform = `translate3d(${current.x + TAG_OFFSET_X}px, ${
        current.y + TAG_OFFSET_Y
      }px, 0)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [tagEnabled]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".tutores-reveal",
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
      id="tutores"
      ref={sectionRef}
      className="relative bg-background-deep py-[130px]"
    >
      {tagEnabled && (
        <div
          ref={tagRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40"
        >
          <span
            className={`block rounded-full border-[0.5px] border-accent-1/40 bg-black-dark/90 px-4 py-2 text-xs font-medium tracking-wide text-accent-1 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeIndex !== null ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {activeIndex !== null ? TUTORES[activeIndex].specialty : ""}
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <h2 className="tutores-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {TUTORES_TITLE.before}
            <span className="text-accent-1">{TUTORES_TITLE.highlight}</span>
            {TUTORES_TITLE.after}
          </h2>
          <p className="tutores-reveal max-w-[54ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {TUTORES_SUBTITLE}
          </p>
        </header>

        <ul
          onPointerLeave={() => setActiveIndex(null)}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {TUTORES.map((tutor, index) => (
            <li
              key={tutor.name}
              onPointerEnter={() => setActiveIndex(index)}
              data-cursor="hover"
              className="tutores-reveal group flex flex-col overflow-hidden rounded-[14px] border-[0.5px] border-accent-2/25 bg-white/[0.03] backdrop-blur-sm transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent-2/50 hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[3/4] shrink-0 overflow-hidden">
                {tutor.photo ? (
                  <Image
                    src={tutor.photo}
                    alt={tutor.name}
                    fill
                    className="tutor-media object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`tutor-media absolute inset-0 flex items-center justify-center text-[2.5rem] font-semibold tracking-[-0.03em] text-white-light/80 ${
                      tutor.tone === "accent-1"
                        ? "projeto-media--accent-1"
                        : "projeto-media--accent-2"
                    }`}
                  >
                    {initialsOf(tutor.name)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 p-5">
                <h3 className="text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-white-light">
                  {tutor.name}
                </h3>
                <p className="text-sm leading-snug text-gray-300">{tutor.role}</p>
                <span
                  className={
                    tagEnabled
                      ? "sr-only"
                      : "mt-2 w-fit rounded-full border-[0.5px] border-accent-1/25 bg-accent-1/[0.08] px-3 py-1 text-xs font-medium text-accent-1"
                  }
                >
                  {tutor.specialty}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
