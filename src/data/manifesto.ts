export const MANIFESTO_HEADLINE =
  "Não formamos alunos. Formamos desenvolvedores que o mercado disputa.";

export const MANIFESTO_HIGHLIGHT = "disputa";

export const MANIFESTO_SUPPORT =
  "Aprenda as tecnologias mais demandadas do mercado com metodologia prática, direto ao ponto e de forma simples.";

export interface ManifestoStat {
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

export const MANIFESTO_STATS: ManifestoStat[] = [
  { prefix: "+", value: 25, suffix: " mil", label: "alunos formados" },
  { value: 85, suffix: "%", label: "contratados em até 6 meses" },
  { value: 4.9, decimals: 1, label: "avaliação média" },
  { prefix: "+", value: 120, label: "empresas parceiras" },
];
