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
    photo: "/tutores/rodolfo.jpg",
  },
  {
    name: "Fernanda Costa",
    role: "Empregabilidade e entrevistas",
    specialty: "Carreira",
    tone: "accent-2",
    photo: "/tutores/fernanda.jpg",
  },
  {
    name: "Agustinho Neto",
    role: "APIs, banco e escala",
    specialty: "Back-End",
    tone: "accent-1",
    photo: "/tutores/agustinho.jpg",
  },
  {
    name: "Henrique Marinho",
    role: "Back-End e DevOps",
    specialty: "Back-End",
    tone: "accent-2",
    photo: "/tutores/henrique.jpg",
  },
  {
    name: "Márcio Tavares",
    role: "Terapeuta Comportamental e Carreira",
    specialty: "Terapeuta Comportamental",
    tone: "accent-1",
    photo: "/tutores/marcio.jpg",
  },
  {
    name: "Juliana Prado",
    role: "Apps iOS e Android",
    specialty: "Mobile",
    tone: "accent-2",
    photo: "/tutores/juliana.jpg",
  },
  {
    name: "Mateus Nogueira",
    role: "Dados, SQL e analytics",
    specialty: "Dados",
    tone: "accent-1",
    photo: "/tutores/mateus.jpg",
  },
];
