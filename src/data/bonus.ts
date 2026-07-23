export const BONUS_TITLE = {
  before: "Módulos Bônus para te levar ",
  highlight: "MAIS LONGE",
  after: "",
};

export const BONUS_SUBTITLE =
  "Aulas fora da grade, com quem vive o assunto na prática. Liberadas junto com a sua formação.";

export type BonusTone = "accent-1" | "accent-2";

export interface AulaBonus {
  specialist: string;
  topic: string;
  duration: string;
  tone: BonusTone;
  image?: string;
  photo?: string;
  youtubeId?: string;
}

export const AULAS_BONUS: AulaBonus[] = [
  {
    specialist: "Radilson Gomes",
    topic: "Processo Criativo",
    duration: "1h33m",
    youtubeId: "",
    tone: "accent-1",
  },
  {
    specialist: "Camila Ferraz",
    topic: "Negociação de Salário",
    duration: "58m",
    youtubeId: "",
    tone: "accent-2",
  },
  {
    specialist: "Bruno Aguiar",
    topic: "Freelance do Zero ao Primeiro Cliente",
    duration: "2h11m",
    youtubeId: "",
    tone: "accent-1",
  },
  {
    specialist: "Letícia Nunes",
    topic: "LinkedIn que Gera Entrevista",
    duration: "1h07m",
    youtubeId: "",
    tone: "accent-2",
  },
  {
    specialist: "Diego Sampaio",
    topic: "Inglês Técnico para Devs",
    duration: "1h45m",
    youtubeId: "",
    tone: "accent-1",
  },
  {
    specialist: "Priscila Nakamura",
    topic: "Produtividade e Foco na Rotina Dupla",
    duration: "1h22m",
    youtubeId: "",
    tone: "accent-2",
  },
];
