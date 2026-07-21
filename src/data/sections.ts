
export type SectionId =
  | "hero"
  | "manifesto"
  | "formacoes"
  | "tecnologias"
  | "alem-do-codigo"
  | "plataforma"
  | "projetos"
  | "comunidade"
  | "tutores"
  | "bonus"
  | "mec"
  | "mercado"
  | "garantia"
  | "faq"
  | "cta"
  | "footer";

export type CursorZone = "drag" | "expand";

export interface SectionMeta {
  id: SectionId;
  label: string;
  cursorZone?: CursorZone;
}

export const SECTIONS: SectionMeta[] = [
  { id: "hero", label: "Hero" },
  { id: "manifesto", label: "Manifesto", cursorZone: "expand" },
  { id: "formacoes", label: "Formações", cursorZone: "drag" },
  { id: "tecnologias", label: "Tecnologias" },
  { id: "alem-do-codigo", label: "Além do Código" },
  { id: "plataforma", label: "Plataforma" },
  { id: "projetos", label: "Projetos Reais" },
  { id: "comunidade", label: "Comunidade" },
  { id: "tutores", label: "Tutores" },
  { id: "bonus", label: "Módulos Bônus" },
  { id: "mec", label: "MEC / Diplomas" },
  { id: "mercado", label: "O mercado paga bem?" },
  { id: "garantia", label: "Garantia" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CTA" },
  { id: "footer", label: "Footer" },
];
