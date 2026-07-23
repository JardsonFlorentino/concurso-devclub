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
    specialist: "Rodolfo Mori",
    topic: "CURSO COMPLETO DE CLAUDE CODE (TUTORIAL PRA INICIANTES)",
    duration: "1h06m",
    youtubeId: "9-ji0LfHaVI",
    tone: "accent-1",
  },
  {
    specialist: "Rodolfo Mori",
    topic: "React do Zero: A Aula que Vai te Tornar um Dev Front End",
    duration: "2h11m",
    youtubeId: "hHcaVgoLLQM",
    tone: "accent-2",
  },
  {
    specialist: "Rodolfo Mori",
    topic: "APRENDA O QUE É HTML E CRIE SEU PRIMEIRO SITE - BÔNUS INCRÍVEL NO FINAL",
    duration: "20m",
    youtubeId: "KDab8z0K3aI",
    tone: "accent-1",
  },
  {
    specialist: "Rodolfo Mori",
    topic: "Criando o site do Nubank do zero | HTML, CSS e JavaScript na prática",
    duration: "1h16m",
    youtubeId: "dl18ltw6AwA",
    tone: "accent-2",
  },
  {
    specialist: "Rodolfo Mori",
    topic: "Curso N8N Gratuito Para Iniciantes 2025",
    duration: "1h33m",
    youtubeId: "RpSPRRn-STY",
    tone: "accent-1",
  },
  {
    specialist: "Rodolfo Mori",
    topic: "Clone do X(Twitter) com React e Tailwind CSS (Passo a Passo)",
    duration: "2h06m",
    youtubeId: "kcyaBJ_B4nc",
    tone: "accent-2",
  },
];
