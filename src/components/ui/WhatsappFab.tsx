"use client";

import { useEffect, useState } from "react";
import { CTA_BUTTON } from "@/data/footer";

const WHATSAPP_LABEL = "Fale com a gente";
const SHOW_AT = 0.72;

export function WhatsappFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > window.innerHeight * SHOW_AT);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href={CTA_BUTTON.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="accent"
      aria-label={`${WHATSAPP_LABEL} no WhatsApp`}
      data-visible={visible || undefined}
      className="whatsapp-fab group fixed bottom-6 right-6 z-[70] flex items-center gap-0 md:bottom-8 md:right-8"
    >
      <span className="whatsapp-fab-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="currentColor"
          aria-hidden="true"
          className="text-black-dark"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.667 1.443h.005c6.585 0 11.946-5.359 11.949-11.945a11.87 11.87 0 00-3.44-8.407" />
        </svg>
      </span>

      <span className="whatsapp-fab-label overflow-hidden whitespace-nowrap text-[13px] font-semibold tracking-[-0.01em] text-black-dark">
        <span className="block pl-1 pr-5">{WHATSAPP_LABEL}</span>
      </span>
    </a>
  );
}
