export const ALUNOS_TITLE = {
  before: "Saíram do zero. Hoje estão ",
  highlight: "contratados",
  after: ".",
};

export const ALUNOS_SUBTITLE =
  "Alguns dos nomes que fizeram a travessia do zero à contratação.";

export interface Aluno {
  name: string;
  location: string;
  role: string;
  photo: string;
}

export const ALUNOS: Aluno[] = [
  {
    name: "Marina Rocha",
    location: "Recife, PE",
    role: "Desenvolvedora Front-End",
    photo: "/alunos/testimonial-1.jpg",
  },
  {
    name: "Thiago Souza",
    location: "Curitiba, PR",
    role: "Desenvolvedor Back-End",
    photo: "/alunos/testimonial-2.jpg",
  },
  {
    name: "Camila Lima",
    location: "Salvador, BA",
    role: "Desenvolvedora Full Stack",
    photo: "/alunos/testimonial-3.jpg",
  },
];

export interface Depoimento {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const DEPOIMENTOS: Depoimento[] = [
  {
    quote:
      "Saí do suporte técnico para o meu primeiro emprego dev em 8 meses. O que mudou foi ter um projeto real no portfólio, não mais um curso na prateleira.",
    name: "Marina Rocha",
    role: "Desenvolvedora Front-End",
    company: "Órbita Digital",
  },
  {
    quote:
      "Eu já tinha tentado aprender sozinho três vezes e travava sempre no mesmo ponto. Aqui a diferença foi ter alguém para destravar na mesma semana.",
    name: "Thiago Souza",
    role: "Desenvolvedor Back-End",
    company: "Vetor Sistemas",
  },
  {
    quote:
      "Entrei achando que era tarde demais aos 34. Seis meses depois eu estava assinando contrato e negociando salário pela primeira vez na vida.",
    name: "Camila Lima",
    role: "Desenvolvedora Full Stack",
    company: "Nuvem Nove",
  },
];
