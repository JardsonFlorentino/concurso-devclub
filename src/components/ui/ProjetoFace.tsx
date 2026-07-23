"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjetoMockup } from "@/components/ui/ProjetoMockup";
import type { Projeto } from "@/data/projetos";

export function ProjetoFace({
  projeto,
  sizes,
}: {
  projeto: Projeto;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);

  if (projeto.image && !failed) {
    return (
      <Image
        src={projeto.image}
        alt=""
        fill
        sizes={sizes}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    );
  }

  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${
          projeto.tone === "accent-1"
            ? "projeto-media--accent-1"
            : "projeto-media--accent-2"
        }`}
      />
      <ProjetoMockup projeto={projeto} />
    </>
  );
}
