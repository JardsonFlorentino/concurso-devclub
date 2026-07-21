export type AlemDoCodigoIcon =
  | "UserSearch"
  | "HeartPulse"
  | "Video"
  | "Bot"
  | "LifeBuoy"
  | "Users"
  | "Briefcase";

export const ALEM_DO_CODIGO_TITLE = {
  before: "Tudo que você precisa ",
  highlight: "ALÉM do Código",
  after: " para evoluir mais rápido",
};

export const ALEM_DO_CODIGO_SUBTITLE =
  "Escrever código é metade do caminho. A outra metade é o que te leva à contratação.";

export interface AlemDoCodigoItem {
  title: string;
  description: string;
  icon: AlemDoCodigoIcon;
}

export const ALEM_DO_CODIGO: AlemDoCodigoItem[] = [
  {
    title: "Recrutadora semanal",
    description:
      "Toda semana uma recrutadora de verdade revisa currículo, LinkedIn e simula entrevista com você.",
    icon: "UserSearch",
  },
  {
    title: "Terapeuta de alta performance",
    description:
      "Sessões em grupo para lidar com a síndrome do impostor, ansiedade e a rotina de quem estuda trabalhando.",
    icon: "HeartPulse",
  },
  {
    title: "Mentorias semanais",
    description:
      "Encontros ao vivo com os tutores para destravar código, revisar projeto e corrigir rota.",
    icon: "Video",
  },
  {
    title: "Dezenas de agentes de IA 24h",
    description:
      "Agentes treinados no método da escola para revisar seu código e explicar o erro às três da manhã.",
    icon: "Bot",
  },
  {
    title: "Suporte humano 7 dias",
    description:
      "Gente de carne e osso respondendo dúvida técnica todos os dias da semana, inclusive fim de semana.",
    icon: "LifeBuoy",
  },
  {
    title: "Maior comunidade tech do Brasil",
    description:
      "Mais de 25 mil devs trocando indicação, code review e vaga no mesmo lugar.",
    icon: "Users",
  },
  {
    title: "Vagas exclusivas",
    description:
      "Empresas parceiras publicam vaga dentro da plataforma antes de abrir para o mercado.",
    icon: "Briefcase",
  },
];
