export const FAQ_TITLE = {
  before: "Perguntas ",
  highlight: "Frequentes",
  after: "",
};

export const FAQ_SUBTITLE =
  "O que as pessoas costumam perguntar antes de entrar. Se ficar qualquer dúvida, o suporte responde todos os dias.";

export interface PerguntaFrequente {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const FAQ_ITENS: PerguntaFrequente[] = [
  {
    question: "É pra iniciante ou precisa de repertório?",
    answer:
      "É para iniciante de verdade. A primeira aula assume que você nunca escreveu uma linha de código e explica até como instalar o editor. Quem já tem base pode pular direto para o teste de nivelamento e começar da trilha certa.",
    defaultOpen: true,
  },
  {
    question: "Já trabalho como programador, vale a pena?",
    answer:
      "Vale se o seu objetivo é subir de senioridade. As trilhas avançadas cobrem arquitetura, banco, testes, deploy e IA aplicada, e as mentorias semanais são onde a maioria dos plenos destrava a promoção.",
  },
  {
    question: "Preciso saber programar antes de entrar?",
    answer:
      "Não. Você precisa de um computador, internet e constância. O método foi desenhado para quem estuda no contraturno do trabalho, com aulas curtas e um projeto por módulo.",
  },
  {
    question: "Tem certificado?",
    answer:
      "Tem diploma, com carga horária de 1.200 horas e validade nacional. Ele serve para processo seletivo, concurso e progressão de carreira — não é um certificado de participação.",
  },
  {
    question: "Até quando posso me inscrever?",
    answer:
      "As matrículas ficam abertas enquanto houver vaga na turma do mês. Quando a turma fecha, a entrada seguinte só abre no ciclo seguinte, com o valor reajustado.",
  },
  {
    question: "Dá pra parcelar?",
    answer:
      "Dá, em até 12x no cartão de crédito. Também aceitamos Pix à vista com desconto e boleto para quem preferir.",
  },
  {
    question: "Como funciona o suporte?",
    answer:
      "Suporte humano sete dias por semana dentro da plataforma, com tempo médio de resposta abaixo de uma hora em dia útil. Fora disso, os agentes de IA atendem 24h e revisam seu código na hora.",
  },
];
