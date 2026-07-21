
export type SectionId =
  | "hero"
  | "manifesto"
  | "formacoes"
  | "tecnologias"
  | "alem-do-codigo"
  | "plataforma"
  | "alunos"
  | "empresas"
  | "tutores"
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
  { id: "alunos", label: "Alunos" },
  { id: "empresas", label: "Empresas" },
  { id: "tutores", label: "Tutores" },
  { id: "cta", label: "CTA" },
  { id: "footer", label: "Footer" },
];
