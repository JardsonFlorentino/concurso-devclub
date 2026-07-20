"use client";

import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}


export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(8);

  return (
    <a
      ref={ref}
      href={href}
      className={`group inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-accent-1 to-accent-1/80 px-7 py-4 text-base font-semibold text-black-dark shadow-[0_0_40px_-12px_var(--accent-1)] transition-shadow duration-500 hover:shadow-[0_0_60px_-8px_var(--accent-1)] ${className ?? ""}`}
    >
      {children}
      <svg
        width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
