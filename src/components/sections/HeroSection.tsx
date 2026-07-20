"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useHeroReveal } from "@/hooks/useHeroReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { introPlaybackEnabled, markRevealed } from "@/hooks/useIntroPhase";
import {
  HERO_BADGE,
  HERO_CTA,
  HERO_HEADLINE,
  HERO_PARAGRAPH,
  HERO_ROLES,
  HERO_SOCIAL_PROOF,
} from "@/data/hero";


const ParticleTextScene = dynamic(
  () => import("@/components/three/ParticleTextScene").then((m) => m.ParticleTextScene),
  { ssr: false },
);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const role = useTypewriter(HERO_ROLES, !prefersReducedMotion);

  useHeroReveal(sectionRef);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden lg:block"
    >
      
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
        <div className="aurora-blob aurora-blob--4" />
        <div className="aurora-blob aurora-blob--5" />
      </div>

      
      <div className="relative z-[1] h-[52vh] w-full shrink-0 lg:absolute lg:inset-0 lg:h-full">
        <ParticleTextScene
          className="h-full w-full"
          playIntro={introPlaybackEnabled}
          onRevealStart={markRevealed}
        />
      </div>

     
      <div className="hero-vignette pointer-events-none absolute inset-0 z-[2]" />
      
      <div className="hero-text-veil pointer-events-none absolute inset-0 z-[3]" />      
      <div className="hero-grain pointer-events-none absolute inset-0 z-[4]" />

      
      <div className="pointer-events-none relative z-10 flex flex-1 items-center px-6 pb-16 pt-10 md:px-10 lg:min-h-screen lg:py-[120px]">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[46%_54%]">          
          <div className="pointer-events-auto relative z-10 flex min-w-0 flex-col items-start gap-7">
            <span className="hero-reveal inline-flex items-center gap-2.5 rounded-full border border-accent-2-surface/40 bg-accent-2-surface/10 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-1 animate-pulse-dot" />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-300">
                {HERO_BADGE}
              </span>
            </span>

            <h1 className="hero-reveal text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05]">
              {HERO_HEADLINE}
              <br />
              <span className="text-accent-1">{role}</span>
              <span className="animate-caret font-normal text-accent-2" aria-hidden="true">
                _
              </span>
            </h1>

            <p className="hero-reveal max-w-[48ch] text-lg leading-relaxed text-gray-300">
              {HERO_PARAGRAPH}
            </p>

            <div className="hero-reveal">
              <MagneticButton href={HERO_CTA.href}>{HERO_CTA.label}</MagneticButton>
            </div>

            <div className="hero-reveal flex items-center gap-4">
              <AvatarGroup avatars={HERO_SOCIAL_PROOF.avatars} />
              <p className="text-sm text-gray-300">
                <strong className="font-semibold text-white-light">
                  {HERO_SOCIAL_PROOF.count}
                </strong>{" "}
                {HERO_SOCIAL_PROOF.text}
              </p>
            </div>

            <div className="hero-reveal w-full pt-2">
              <LogoMarquee />
            </div>
          </div>
          
          <div aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
