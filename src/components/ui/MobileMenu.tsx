"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getSmoothScrollInstance } from "@/hooks/useSmoothScrollInstance";
import {
  HEADER_PRIMARY_CTA,
  HEADER_SECONDARY_CTA,
  NAV_LINKS,
} from "@/data/navigation";

const CLOSE_DELAY = 260;

interface MobileMenuProps {
  visible: boolean;
  activeHref: string | null;
  onClose: () => void;
}

export function MobileMenu({ visible, activeHref, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const lenis = getSmoothScrollInstance();

    lenis?.stop();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      const panel = panelRef.current;
      if (!panel || event.key !== "Tab") return;

      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (prefersReducedMotion || !visible) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".mobile-menu-reveal",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.1,
        },
      );
    }, panelRef);

    return () => context.revert();
  }, [prefersReducedMotion, visible]);

  const goTo = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      onClose();

      window.setTimeout(() => {
        const lenis = getSmoothScrollInstance();
        if (lenis) {
          lenis.scrollTo(target, { offset: -72 });
          return;
        }
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }, CLOSE_DELAY);
    },
    [onClose, prefersReducedMotion],
  );

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      data-visible={visible || undefined}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="mobile-menu fixed inset-0 z-40 flex flex-col justify-center px-6 pb-10 pt-24 lg:hidden"
    >
      <span aria-hidden="true" className="mobile-menu-aurora" />

      <nav className="relative flex flex-col gap-2">
        {NAV_LINKS.map((link) => {
          const current = activeHref === link.href;

          return (
            <span key={link.href} className="block overflow-hidden py-1">
              <a
                href={link.href}
                aria-current={current ? "true" : undefined}
                onClick={(event) => goTo(event, link.href)}
                className={`mobile-menu-reveal block text-[clamp(2rem,9vw,2.5rem)] font-semibold leading-[1.14] tracking-[-0.03em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  current ? "text-accent-1" : "text-white-light"
                }`}
              >
                {link.label}
              </a>
            </span>
          );
        })}
      </nav>

      <span aria-hidden="true" className="mobile-menu-rule relative my-9" />

      <div className="relative flex flex-col gap-3">
        <span className="block overflow-hidden">
          <a
            href={HEADER_SECONDARY_CTA.href}
            target={HEADER_SECONDARY_CTA.target}
            rel={HEADER_SECONDARY_CTA.rel}
            onClick={onClose}
            className="mobile-menu-reveal block rounded-[14px] border border-white/15 px-6 py-4 text-center text-base font-medium text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/30 hover:text-white-light"
          >
            {HEADER_SECONDARY_CTA.label}
          </a>
        </span>

        <span className="block overflow-hidden">
          <a
            href={HEADER_PRIMARY_CTA.href}
            target={HEADER_PRIMARY_CTA.target}
            rel={HEADER_PRIMARY_CTA.rel}
            onClick={onClose}
            className="mobile-menu-reveal block rounded-[14px] bg-accent-1 px-6 py-4 text-center text-base font-semibold text-black-dark shadow-[0_0_38px_-12px_var(--accent-1)]"
          >
            {HEADER_PRIMARY_CTA.label}
          </a>
        </span>
      </div>
    </div>
  );
}
