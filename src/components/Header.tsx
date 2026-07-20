"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIntroPhase } from "@/hooks/useIntroPhase";
import {
  BRAND_LOGO,
  BRAND_NAME,
  HEADER_PRIMARY_CTA,
  HEADER_SECONDARY_CTA,
  NAV_LINKS,
} from "@/data/navigation";

const EASE_STANDARD = "cubic-bezier(0.16,1,0.3,1)";

function PrimaryCta({ onNavigate }: { onNavigate?: () => void }) {
  const ref = useMagnetic<HTMLAnchorElement>(6);

  return (
    <a
      ref={ref}
      href={HEADER_PRIMARY_CTA.href}
      target={HEADER_PRIMARY_CTA.target}
      rel={HEADER_PRIMARY_CTA.rel}
      aria-label={HEADER_PRIMARY_CTA.label}
      onClick={onNavigate}
      className="rounded-[14px] bg-accent-1 px-5 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-black-dark transition-shadow duration-500 hover:shadow-[0_0_32px_-8px_var(--accent-1)]"
    >
      {HEADER_PRIMARY_CTA.label}
    </a>
  );
}

function SecondaryCta({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      href={HEADER_SECONDARY_CTA.href}
      target={HEADER_SECONDARY_CTA.target}
      rel={HEADER_SECONDARY_CTA.rel}
      aria-label={HEADER_SECONDARY_CTA.label}
      onClick={onNavigate}
      className="rounded-[14px] border border-white/12 px-4 py-2.5 text-[13px] font-medium tracking-[-0.01em] text-gray-300 transition-colors duration-300 hover:border-white/25 hover:text-white-light"
    >
      {HEADER_SECONDARY_CTA.label}
    </a>
  );
}

function MobileMenuPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".mobile-menu-item",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.05 },
      );
    }, panelRef);
    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-40 flex flex-col justify-center bg-black-dark px-6 lg:hidden"
    >
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="mobile-menu-item py-1.5 text-[clamp(2.5rem,11vw,4rem)] font-bold leading-[1.06] tracking-[-0.04em] text-white-light"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="mobile-menu-item mt-12 flex flex-col gap-3 border-t border-white/10 pt-8">
        <a
          href={HEADER_SECONDARY_CTA.href}
          target={HEADER_SECONDARY_CTA.target}
          rel={HEADER_SECONDARY_CTA.rel}
          onClick={onClose}
          className="rounded-[14px] border border-white/15 px-6 py-3.5 text-center text-base font-medium text-gray-300"
        >
          {HEADER_SECONDARY_CTA.label}
        </a>
        <a
          href={HEADER_PRIMARY_CTA.href}
          onClick={onClose}
          className="rounded-[14px] bg-accent-1 px-6 py-3.5 text-center text-base font-semibold text-black-dark"
        >
          {HEADER_PRIMARY_CTA.label}
        </a>
      </div>
    </div>
  );
}

export function Header() {
  const { isScrolled, isHidden } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const introPhase = useIntroPhase();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.killTweensOf(header);

    if (introPhase === "intro") {
      gsap.set(header, { opacity: 0 });
      return;
    }
    gsap.to(header, { opacity: 1, duration: 1, ease: "power3.out" });

    return () => {
      gsap.killTweensOf(header);
    };
  }, [introPhase]);

  const headerHidden = isHidden && !menuOpen;
  const compact = isScrolled && !menuOpen;

  return (
    <>
      <header
        ref={headerRef}
        style={{ transitionTimingFunction: EASE_STANDARD }}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,height,border-color] duration-[400ms] ${
          headerHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          compact
            ? "h-16 border-b border-white/10 bg-[rgba(17,16,18,0.7)] backdrop-blur-xl"
            : "h-20 border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-8 px-6 md:px-10">
          <a
            href="#hero"
            aria-label={BRAND_NAME}
            className="relative z-50 flex shrink-0 items-center"
          >
            <Image
              src={BRAND_LOGO}
              alt={BRAND_NAME}
              width={142}
              height={142}
              priority
              style={{ transitionTimingFunction: EASE_STANDARD }}
              className={`w-auto transition-[height] duration-[400ms] ${
                compact ? "h-7" : "h-9"
              }`}
            />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-[13px] font-medium tracking-[-0.01em] text-gray-300 transition-colors duration-300 hover:text-white-light"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <SecondaryCta />
            <PrimaryCta />
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-50 -mr-2 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              style={{ transitionTimingFunction: EASE_STANDARD }}
              className={`h-px w-6 bg-white-light transition-transform duration-300 ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              style={{ transitionTimingFunction: EASE_STANDARD }}
              className={`h-px w-6 bg-white-light transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {menuOpen && <MobileMenuPanel onClose={() => setMenuOpen(false)} />}
    </>
  );
}
