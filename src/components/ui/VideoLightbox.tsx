"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getSmoothScrollInstance } from "@/hooks/useSmoothScrollInstance";

interface VideoLightboxProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export function VideoLightbox({ youtubeId, title, onClose }: VideoLightboxProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const panel = panelRef.current;
    if (!panel || event.key !== "Tab") return;

    const focusables = panel.querySelectorAll<HTMLElement>(
      "button, iframe, a[href]",
    );
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
  }, []);

  useEffect(() => {
    const lenis = getSmoothScrollInstance();
    const gap = window.innerWidth - document.documentElement.clientWidth;

    lenis?.stop();
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      lenis?.start();
    };
  }, [onClose, trapFocus]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="video-lightbox fixed inset-0 z-[120] flex items-center justify-center px-5 py-10"
    >
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
        className="video-lightbox-panel relative w-full max-w-[900px]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar player"
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/[0.06] text-white-light transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/50 hover:text-accent-1"
        >
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="video-lightbox-frame relative aspect-video w-full overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
