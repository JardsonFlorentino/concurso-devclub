
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

export interface SectionMeta {
  id: SectionId;
  label: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: "hero", label: "Hero" },
  { id: "manifesto", label: "Manifesto" },
  { id: "formacoes", label: "Formações" },
  { id: "alunos", label: "Alunos" },
  { id: "empresas", label: "Empresas" },
  { id: "tutores", label: "Tutores" },
  { id: "tecnologias", label: "Tecnologias" },
  { id: "cta", label: "CTA" },
  { id: "footer", label: "Footer" },
];
