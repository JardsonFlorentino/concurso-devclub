export const GARANTIA_TAG = "Risco zero pra você";

export const GARANTIA_TITLE = {
  before: "7 dias de garantia ",
  highlight: "incondicional",
  after: "",
};

export const GARANTIA_DESCRIPTION =
  "Você entra, assiste, testa a plataforma inteira e decide depois. Se não for pra você, devolvemos tudo — sem formulário de retenção, sem ligação de convencimento.";

export const GARANTIA_SELO = {
  value: "7",
  unit: "dias",
  ring: "GARANTIA INCONDICIONAL · DEVCLUB · ",
};

export interface PassoGarantia {
  title: string;
  description: string;
}

export const GARANTIA_PASSOS: PassoGarantia[] = [
  {
    title: "Compre hoje e acesse imediatamente",
    description:
      "O acesso cai no seu e-mail em minutos. Nada de fila de espera ou turma que só abre mês que vem.",
  },
  {
    title: "Use a plataforma como quiser por 7 dias",
    description:
      "Aulas, comunidade, mentoria, agentes de IA. Tudo liberado, sem versão reduzida de degustação.",
  },
  {
    title: "Não gostou? Mande um e-mail e receba 100% de volta",
    description:
      "Um e-mail basta, e o prazo de reembolso ainda se estende além dos 7 dias. Devolvemos o valor integral, sem você justificar o motivo.",
  },
];
