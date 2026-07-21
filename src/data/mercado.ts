export const MERCADO_TITLE = {
  before: "O mercado ",
  highlight: "paga bem?",
  after: "",
};

export const MERCADO_SUBTITLE =
  "Médias anuais por senioridade. No exterior, a mesma stack vale em dólar — e é para lá que muitos alunos migram.";

export const MERCADO_FOOTNOTE =
  "Valores anuais brutos, em reais. Referência de mercado para desenvolvedores full stack em 2026.";

export const MERCADO_SERIES = {
  brasil: "Brasil",
  internacional: "Internacional",
};

export interface NivelSalarial {
  level: string;
  brasil: number;
  internacional: number;
}

export const MERCADO_NIVEIS: NivelSalarial[] = [
  { level: "Júnior", brasil: 70000, internacional: 135000 },
  { level: "Pleno", brasil: 140000, internacional: 200000 },
  { level: "Sênior", brasil: 196000, internacional: 307000 },
];
