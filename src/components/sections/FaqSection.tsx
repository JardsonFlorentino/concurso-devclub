"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FAQ_ITENS, FAQ_SUBTITLE, FAQ_TITLE } from "@/data/faq";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_OPEN = new Set(
  FAQ_ITENS.reduce<number[]>(
    (acc, item, index) => (item.defaultOpen ? [...acc, index] : acc),
    [],
  ),
);

export function FaqSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(INITIAL_OPEN);
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".faq-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: section, start: "top 74%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative bg-background py-[130px]"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-10">
        <header data-parallax="-24" className="flex flex-col gap-4">
          <h2 className="faq-reveal max-w-[20ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light">
            {FAQ_TITLE.before}
            <span className="text-accent-1">{FAQ_TITLE.highlight}</span>
            {FAQ_TITLE.after}
          </h2>
          <p className="faq-reveal max-w-[58ch] text-[0.9375rem] leading-relaxed text-gray-300">
            {FAQ_SUBTITLE}
          </p>
        </header>

        <ul className="mt-14 flex max-w-[860px] flex-col border-t border-white/10">
          {FAQ_ITENS.map((item, index) => {
            const open = openItems.has(index);

            return (
              <li key={item.question} className="faq-reveal border-b border-white/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent-1"
                  >
                    <span
                      className={`text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-[1.1875rem] ${
                        open ? "text-accent-1" : "text-white-light"
                      }`}
                    >
                      {item.question}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`faq-icon relative h-6 w-6 shrink-0 rounded-full border-[0.5px] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open
                          ? "rotate-90 border-accent-1/50"
                          : "rotate-0 border-white/20"
                      }`}
                    >
                      <span
                        className={`absolute left-1/2 top-1/2 h-px w-[11px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${
                          open ? "bg-accent-1" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`faq-icon-bar absolute left-1/2 top-1/2 h-[11px] w-px -translate-x-1/2 -translate-y-1/2 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          open ? "scale-y-0 bg-accent-1" : "scale-y-100 bg-gray-300"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  className={`faq-panel grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[68ch] pb-7 pr-10 text-[0.9375rem] leading-relaxed text-gray-300">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
