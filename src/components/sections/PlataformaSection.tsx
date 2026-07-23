"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessagesSquare,
  MonitorPlay,
  Route,
  Sparkles,
  TerminalSquare,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlataformaMockup } from "@/components/ui/PlataformaMockup";
import {
  PLATAFORMA_DESCRIPTION,
  PLATAFORMA_FEATURES,
  PLATAFORMA_TITLE,
  type PlataformaIcon,
} from "@/data/plataforma";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<PlataformaIcon, LucideIcon> = {
  MonitorPlay,
  Route,
  MessagesSquare,
  Sparkles,
  TerminalSquare,
  Trophy,
};

const TOTAL = PLATAFORMA_FEATURES.length;
const LAST_SHARE = 0.1;
const STEP = (1 - LAST_SHARE) / (TOTAL - 1);

export function PlataformaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".plataforma-reveal",
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onUpdate: (self) => {
            const index =
              self.progress >= 1 - LAST_SHARE
                ? TOTAL - 1
                : Math.min(
                    TOTAL - 2,
                    Math.max(0, Math.floor(self.progress / STEP)),
                  );
            setActive((current) => (current === index ? current : index));
          },
        });

        ScrollTrigger.refresh();

        return () => trigger.kill();
      },
    );

    return () => media.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="plataforma"
      ref={sectionRef}
      className="relative bg-background-deep"
    >
      <div
        ref={trackRef}
        className={
          prefersReducedMotion ? "py-[130px]" : "py-[130px] lg:h-[420vh] lg:py-0"
        }
      >
        <div
          className={
            prefersReducedMotion
              ? ""
              : "lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:py-6"
          }
        >
          <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-6 md:px-10 lg:max-h-full lg:min-h-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-7 lg:gap-4">
              <header className="flex flex-col gap-5 lg:gap-3">
                <h2 className="plataforma-reveal text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white-light lg:text-[clamp(1.875rem,3vw,2.75rem)]">
                  {PLATAFORMA_TITLE.before}
                  <span className="text-accent-1">
                    {PLATAFORMA_TITLE.highlight}
                  </span>
                  {PLATAFORMA_TITLE.after}
                </h2>
                <p className="plataforma-reveal max-w-[46ch] text-[0.9375rem] leading-relaxed text-gray-300 lg:max-w-[42ch] lg:text-sm">
                  {PLATAFORMA_DESCRIPTION}
                </p>
              </header>

              <ul className="plataforma-reveal flex flex-col gap-1 lg:gap-0.5">
                {PLATAFORMA_FEATURES.map((feature, index) => {
                  const Icon = ICONS[feature.icon];
                  const current = index === active;

                  return (
                    <li
                      key={feature.title}
                      data-active={current || undefined}
                      className="plataforma-item flex flex-col gap-4 rounded-[12px] px-4 py-3 lg:py-2"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="plataforma-item-icon mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-[0.5px]">
                          <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                        </span>

                        <div className="flex flex-col">
                          <h3 className="plataforma-item-title text-[1rem] font-semibold leading-snug tracking-[-0.01em]">
                            {feature.title}
                          </h3>
                          <div className="plataforma-item-body grid">
                            <p className="plataforma-item-text overflow-hidden text-sm leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="plataforma-panel plataforma-panel--inline lg:hidden">
                        <div className="plataforma-panel-inner">
                          <PlataformaMockup kind={feature.mockup} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative hidden lg:block">
              <span
                aria-hidden="true"
                className="plataforma-glow pointer-events-none absolute -inset-12 -z-10"
              />

              <div className="relative mx-auto aspect-[4/3] w-full max-h-[46vh]">
                {PLATAFORMA_FEATURES.map((feature, index) => (
                  <div
                    key={feature.title}
                    aria-hidden={index !== active}
                    data-active={index === active || undefined}
                    className="plataforma-panel plataforma-panel--stage absolute inset-0"
                  >
                    <div className="plataforma-panel-inner">
                      <PlataformaMockup kind={feature.mockup} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {PLATAFORMA_FEATURES.map((feature, index) => (
                  <span
                    key={feature.title}
                    aria-hidden="true"
                    className={`h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index === active ? "w-8 bg-accent-1" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
