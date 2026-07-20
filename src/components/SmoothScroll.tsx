"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Integra o Lenis (smooth scroll) ao ScrollTrigger do GSAP.
 *
 * Sem essa ponte os dois brigam: o Lenis interpola a posição do scroll fora do
 * fluxo nativo, então o ScrollTrigger precisa ser avisado a cada frame
 * interpolado (lenis.on("scroll", ...)) e o RAF do Lenis precisa rodar no ticker
 * do GSAP para os dois compartilharem o mesmo relógio — caso contrário as
 * animações com scrub ficam um frame atrasadas e tremem.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Usuários com reduced-motion ficam no scroll nativo do navegador.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Curva exponencial: desacelera longo e macio, casando com o power3.out do GSAP.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // O ticker entrega o tempo em segundos; o Lenis espera milissegundos.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
