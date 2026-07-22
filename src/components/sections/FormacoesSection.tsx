"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FormacaoCard } from "@/components/ui/FormacaoCard";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToPosition } from "@/hooks/useSmoothScrollInstance";
import {
  FORMACAO_CATEGORIES,
  FORMACOES_ALL_LABEL,
  FORMACOES_TITLE,
} from "@/data/formacoes";

gsap.registerPlugin(ScrollTrigger);

const ALL_TAB = "all";
const DRAG_SPEED = 1.35;
const LANE_PERSPECTIVE = 1400;
const LANE_ROTATION = 22;
const LANE_SCALE_FOCUS = 1.04;
const LANE_SCALE_EDGE = 0.92;
const LANE_DEPTH = 180;
const LANE_OPACITY_EDGE = 0.75;
const FOCUS_THRESHOLD = 0.24;

export function FormacoesSection() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const hasEnteredRef = useRef(false);
  const lanesRef = useRef<{ element: HTMLElement; center: number }[]>([]);
  const curvedRef = useRef(false);

  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const prefersReducedMotion = usePrefersReducedMotion();

  const tabs = useMemo(
    () => [
      { id: ALL_TAB, label: FORMACOES_ALL_LABEL },
      ...FORMACAO_CATEGORIES.map((category) => ({
        id: category.number,
        label: category.name,
      })),
    ],
    [],
  );

  const cardIndexByName = useMemo(() => {
    const map = new Map<string, number>();
    let running = 0;
    const source =
      activeTab === ALL_TAB
        ? FORMACAO_CATEGORIES
        : FORMACAO_CATEGORIES.filter((category) => category.number === activeTab);
    source.forEach((category) =>
      category.items.forEach((item) => map.set(item.name, running++)),
    );
    return map;
  }, [activeTab]);

  const visibleCategories = useMemo(
    () =>
      activeTab === ALL_TAB
        ? FORMACAO_CATEGORIES
        : FORMACAO_CATEGORIES.filter((category) => category.number === activeTab),
    [activeTab],
  );

  const measureLanes = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    lanesRef.current = Array.from(
      track.querySelectorAll<HTMLElement>("[data-lane]"),
    ).map((element) => ({
      element,
      center: element.offsetLeft + element.offsetWidth / 2,
    }));
  }, []);

  const updateLanes = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const lanes = lanesRef.current;
    if (!track || !viewport || !curvedRef.current || !lanes.length) return;

    const bounds = viewport.getBoundingClientRect();
    const origin = track.getBoundingClientRect().left;
    const middle = bounds.left + bounds.width / 2;
    const reach = bounds.width / 2;

    let focusIndex = 0;
    let focusDistance = Infinity;

    const offsets = lanes.map((lane, index) => {
      const offset = gsap.utils.clamp(
        -1,
        1,
        (origin + lane.center - middle) / reach,
      );
      const distance = Math.abs(offset);
      if (distance < focusDistance) {
        focusDistance = distance;
        focusIndex = index;
      }
      return { offset, distance };
    });

    lanes.forEach((lane, index) => {
      const { offset, distance } = offsets[index];
      const scale =
        LANE_SCALE_FOCUS - (LANE_SCALE_FOCUS - LANE_SCALE_EDGE) * distance;

      lane.element.style.transform = `perspective(${LANE_PERSPECTIVE}px) translateZ(${
        -LANE_DEPTH * distance
      }px) rotateY(${-offset * LANE_ROTATION}deg) scale(${scale})`;
      lane.element.style.opacity = `${
        1 - (1 - LANE_OPACITY_EDGE) * distance
      }`;
      lane.element.style.zIndex = `${Math.round((1 - distance) * 100)}`;

      if (index === focusIndex && focusDistance < FOCUS_THRESHOLD) {
        lane.element.setAttribute("data-focus", "");
      } else {
        lane.element.removeAttribute("data-focus");
      }
    });
  }, []);

  const resetLanes = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    track.querySelectorAll<HTMLElement>("[data-lane]").forEach((element) => {
      element.style.transform = "";
      element.style.opacity = "";
      element.style.zIndex = "";
      element.removeAttribute("data-focus");
    });
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        title,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 82%", once: true },
        },
      );
    }, title);

    return () => context.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    const indicator = indicatorRef.current;
    if (!tabsElement || !indicator) return;

    const moveIndicator = () => {
      const active = tabsElement.querySelector<HTMLElement>(
        `[data-tab="${activeTab}"]`,
      );
      if (!active) return;
      const target = {
        x: active.offsetLeft,
        width: active.offsetWidth,
      };
      if (prefersReducedMotion) {
        gsap.set(indicator, target);
        return;
      }
      gsap.to(indicator, { ...target, duration: 0.6, ease: "power3.out" });
    };

    moveIndicator();
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [activeTab, prefersReducedMotion]);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const progressBar = progressBarRef.current;
    const viewport = viewportRef.current;
    if (!pin || !track || !progress || !progressBar || !viewport) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const getDistance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
        curvedRef.current = true;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          onUpdate: updateLanes,
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.max(getDistance(), 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              scrollTriggerRef.current = self;
              progressBar.style.opacity = getDistance() > 0 ? "1" : "0";
              measureLanes();
              updateLanes();
            },
            onUpdate: (self) => {
              progress.style.transform = `scaleX(${self.progress})`;
              updateLanes();
            },
          },
        });

        measureLanes();
        updateLanes();

        let dragging = false;
        let dragStartX = 0;
        let dragStartScroll = 0;

        const onPointerDown = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          dragging = true;
          dragStartX = event.clientX;
          dragStartScroll = window.scrollY;
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!dragging) return;
          scrollToPosition(dragStartScroll + (dragStartX - event.clientX) * DRAG_SPEED);
        };

        const stopDragging = () => {
          dragging = false;
        };

        viewport.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", stopDragging);
        window.addEventListener("pointercancel", stopDragging);

        return () => {
          scrollTriggerRef.current = null;
          curvedRef.current = false;
          resetLanes();
          tween.scrollTrigger?.kill();
          tween.kill();
          viewport.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", stopDragging);
          window.removeEventListener("pointercancel", stopDragging);
        };
      },
    );

    media.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      curvedRef.current = false;
      resetLanes();

      const onScroll = () => {
        const distance = viewport.scrollWidth - viewport.clientWidth;
        progressBar.style.opacity = distance > 0 ? "1" : "0";
        progress.style.transform = `scaleX(${
          distance > 0 ? viewport.scrollLeft / distance : 0
        })`;
      };
      onScroll();
      viewport.addEventListener("scroll", onScroll, { passive: true });
      return () => viewport.removeEventListener("scroll", onScroll);
    });

    return () => media.revert();
  }, [prefersReducedMotion, measureLanes, updateLanes, resetLanes]);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    measureLanes();
    updateLanes();

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      ScrollTrigger.refresh();
      return;
    }

    if (!hasEnteredRef.current) {
      gsap.set(cards, { opacity: 0, y: 42, scale: 0.94 });
      const reveal = ScrollTrigger.create({
        trigger: pin,
        start: "top 78%",
        once: true,
        onEnter: () => {
          hasEnteredRef.current = true;
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
          });
        },
      });
      return () => reveal.kill();
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 36, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      },
    );

    ScrollTrigger.refresh();
    const start = scrollTriggerRef.current?.start;
    if (typeof start === "number") scrollToPosition(start);
  }, [activeTab, prefersReducedMotion, measureLanes, updateLanes]);

  const handleTabChange = (next: string) => {
    if (next === activeTab) return;
    const track = trackRef.current;

    if (prefersReducedMotion || !track) {
      setActiveTab(next);
      return;
    }

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    gsap.to(cards, {
      opacity: 0,
      y: -18,
      scale: 0.96,
      duration: 0.36,
      ease: "power2.in",
      stagger: 0.03,
      onComplete: () => setActiveTab(next),
    });
  };

  return (
    <section id="formacoes" data-cursor="drag" className="relative bg-background">
      <div className="relative z-10 px-6 pb-14 pt-[130px] md:px-10">
        <h2
          ref={titleRef}
          className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-white-light"
        >
          {FORMACOES_TITLE.before}
          <span className="whitespace-nowrap text-accent-1">
            {FORMACOES_TITLE.firstHighlight}
          </span>
          {FORMACOES_TITLE.middle}
          <span className="whitespace-nowrap text-accent-1">
            {FORMACOES_TITLE.secondHighlight}
          </span>
        </h2>
      </div>

      <div ref={pinRef} className="relative lg:h-screen">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="aurora-blob aurora-blob--f1" />
          <div className="aurora-blob aurora-blob--f2" />
          <div className="aurora-blob aurora-blob--f3" />
          <div className="formacoes-glow absolute inset-0" />
          <div className="absolute inset-0 bg-black-dark/50" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center gap-10 lg:gap-14">
          <div className="px-6 md:px-10">
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Categorias de formações"
              className="relative mx-auto flex w-max max-w-full gap-1 overflow-x-auto rounded-full border-[0.5px] border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-[calc(100%-0.75rem)] rounded-full border-[0.5px] border-accent-1/40 bg-accent-1/12"
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  data-tab={tab.id}
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative z-10 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeTab === tab.id
                      ? "text-accent-1"
                      : "text-gray-400 hover:text-white-light"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={viewportRef}
            className="flex snap-x snap-mandatory items-center overflow-x-auto scroll-pl-6 pb-16 pt-12 md:scroll-pl-10 lg:snap-none lg:overflow-hidden lg:py-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              ref={trackRef}
              className="relative flex items-center gap-6 px-6 md:px-10"
            >
              {visibleCategories.map((category) => (
                <Fragment key={category.number}>
                  <div
                    data-card
                    className="flex w-[220px] shrink-0 snap-start flex-col gap-3 md:w-[260px]"
                  >
                    <span className="font-mono text-sm text-accent-1">
                      {category.number}
                    </span>
                    <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white-light">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-300">
                      {category.items.length} formações
                    </span>
                  </div>

                  {category.items.map((formacao) => (
                    <div key={formacao.name} data-lane className="formacao-lane">
                      <FormacaoCard
                        formacao={formacao}
                        index={cardIndexByName.get(formacao.name) ?? 0}
                      />
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={progressBarRef}
          className="absolute inset-x-6 bottom-8 z-10 h-px bg-white/10 transition-opacity duration-500 md:inset-x-10"
        >
          <span
            ref={progressRef}
            className="block h-full origin-left scale-x-0 bg-accent-1"
          />
        </div>
      </div>

      <div className="h-[130px]" />
    </section>
  );
}
