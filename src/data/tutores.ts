export const TUTORES_TITLE = {
  before: "Aprenda com os ",
  highlight: "Melhores",
  after: "",
};

export const TUTORES_SUBTITLE =
  "Quem te ensina já entregou software em produção e já contratou dev. Não é teoria de slide.";

export type TutorTone = "accent-1" | "accent-2";

export interface Tutor {
  name: string;
  role: string;
  specialty: string;
  tone: TutorTone;
  photo?: string;
}

export const TUTORES: Tutor[] = [
  {
    name: "Rodolfo Mori",
    role: "Fundador do DevClub",
    specialty: "Fundador",
    tone: "accent-1",
  },
  {
    name: "Fernanda Lopes",
    role: "Interfaces e design system",
    specialty: "Front-End",
    tone: "accent-2",
  },
  {
    name: "Agustinho Reis",
    role: "APIs, banco e escala",
    specialty: "Back-End",
    tone: "accent-1",
  },
  {
    name: "Henrique Vidal",
    role: "Agentes e IA aplicada",
    specialty: "IA",
    tone: "accent-2",
  },
  {
    name: "Márcio Tavares",
    role: "Empregabilidade e entrevista",
    specialty: "Carreira",
    tone: "accent-1",
  },
  {
    name: "Juliana Prado",
    role: "Apps iOS e Android",
    specialty: "Mobile",
    tone: "accent-2",
  },
  {
    name: "Mateus Aranha",
    role: "Dados, SQL e analytics",
    specialty: "Dados",
    tone: "accent-1",
  },
];
