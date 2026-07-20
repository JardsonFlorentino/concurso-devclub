
export type SectionId =
  | "hero"
  | "manifesto"
  | "formacoes"
  | "alunos"
  | "empresas"
  | "tutores"
  | "tecnologias"
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
  { id: "alunos", label: "Alunos" },
  { id: "empresas", label: "Empresas" },
  { id: "tutores", label: "Tutores" },
  { id: "tecnologias", label: "Tecnologias" },
  { id: "cta", label: "CTA" },
  { id: "footer", label: "Footer" },
];
