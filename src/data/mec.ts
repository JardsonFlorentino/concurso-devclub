export const MEC_TITLE = {
  before: "Escola Reconhecida pelo ",
  highlight: "MEC",
  after: " e com Diplomas Oficiais",
};

export const MEC_DESCRIPTION =
  "Ao concluir sua formação você recebe um diploma com validade nacional, aceito em processo seletivo, concurso e progressão de carreira. Não é certificado de participação.";

export interface SeloMec {
  label: string;
  value: string;
}

export const MEC_SELOS: SeloMec[] = [
  { label: "Reconhecimento", value: "MEC" },
  { label: "Carga horária", value: "1.200h" },
  { label: "Validade", value: "Nacional" },
];

export const MEC_DIPLOMA = {
  institution: "DevClub Educação",
  award: "Certificado de Conclusão",
  student: "Marina Rocha de Albuquerque",
  course: "Formação Full Stack",
  workload: "1.200 horas",
  issuedAt: "Julho de 2026",
  registry: "Registro nº 2026.04871-DC",
  signature: "Rodolfo Mori",
  signatureRole: "Diretor Acadêmico",
};
