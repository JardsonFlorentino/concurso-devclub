"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { StatCounter } from "@/components/ui/StatCounter";
import { DustField } from "@/components/ui/DustField";
import {
  MANIFESTO_HEADLINE,
  MANIFESTO_HIGHLIGHT,
  MANIFESTO_STATS,
  MANIFESTO_SUPPORT,
} from "@/data/manifesto";

gsap.registerPlugin(ScrollTrigger);

const DIM_OPACITY = 0.2;
const SWEEP_END = 0.72;
const SWEEP_FEATHER = 0.2;
const SUPPORT_START = 0.76;

function normalizeWord(word: string) {
  return word.replace(/[.,;:!?]/g, "").toLowerCase();
}

export function ManifestoSection() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const supportRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const runway = runwayRef.current;
    const headline = headlineRef.current;
    const support = supportRef.current;
    if (!runway || !headline || !support) return;

    const characters = Array.from(
      headline.querySelectorAll<HTMLElement>(".sweep-char"),
    );
    const highlight = headline.querySelector<HTMLElement>(".manifesto-highlight");

    if (prefersReducedMotion) {
      characters.forEach((character) => {
        character.style.opacity = "1";
      });
      highlight?.classList.add("is-lit");
      support.style.opacity = "1";
      support.style.transform = "none";
      return;
    }

    const clamp = gsap.utils.clamp(0, 1);

    const applyProgress = (progress: number) => {
      const sweep = clamp(progress / SWEEP_END);

      characters.forEach((character, index) => {
        const start = (index / characters.length) * (1 - SWEEP_FEATHER);
        const local = clamp((sweep - start) / SWEEP_FEATHER);
        character.style.opacity = String(DIM_OPACITY + (1 - DIM_OPACITY) * local);
      });

      highlight?.classList.toggle("is-lit", sweep >= 0.999);

      const supportProgress = clamp(
        (progress - SUPPORT_START) / (1 - SUPPORT_START),
      );
      support.style.opacity = String(supportProgress);
      support.style.transform = `translateY(${24 * (1 - supportProgress)}px)`;
    };

    applyProgress(0);

    const scrollState = { progress: 0 };
    const scrubTween = gsap.to(scrollState, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
      onUpdate: () => applyProgress(scrollState.progress),
    });

    return () => {
      scrubTween.scrollTrigger?.kill();
      scrubTween.kill();
    };
  }, [prefersReducedMotion]);

  const words = MANIFESTO_HEADLINE.split(" ");

  return (
    <section
      id="manifesto"
      data-cursor="expand"
      className="relative bg-background"
    >
      <DustField className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      <div ref={runwayRef} className="relative z-10 h-[140vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center px-6 md:px-10">
          <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
            <h2
              ref={headlineRef}
              className="mx-auto max-w-[26ch] text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.02em]"
            >
              {words.map((word, wordIndex) => {
                const isHighlight = normalizeWord(word) === MANIFESTO_HIGHLIGHT;
                return (
                  <Fragment key={`${word}-${wordIndex}`}>
                    <span
                      className={`inline-block ${isHighlight ? "manifesto-highlight" : ""}`}
                    >
                      {Array.from(word).map((character, characterIndex) => (
                        <span
                          key={`${character}-${characterIndex}`}
                          className="sweep-char"
                        >
                          {character}
                        </span>
                      ))}
                    </span>
                    {wordIndex < words.length - 1 ? " " : ""}
                  </Fragment>
                );
              })}
            </h2>

            <p
              ref={supportRef}
              className="mt-7 max-w-[56ch] text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-gray-400"
            >
              {MANIFESTO_SUPPORT}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-[180px] px-6 pb-[130px] md:px-10">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {MANIFESTO_STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
