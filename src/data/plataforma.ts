export type PlataformaIcon =
  | "MonitorPlay"
  | "Route"
  | "MessagesSquare"
  | "Sparkles"
  | "TerminalSquare"
  | "Trophy";

export const PLATAFORMA_TITLE = {
  before: "Uma ",
  highlight: "plataforma completa",
  after: " para sua evolução",
};

export const PLATAFORMA_DESCRIPTION =
  "Aulas, comunidade, vagas e inteligência artificial no mesmo lugar. Você abre o navegador e tem tudo o que precisa para sair do zero à contratação, sem depender de dez ferramentas soltas.";

export interface PlataformaFeature {
  title: string;
  description: string;
  icon: PlataformaIcon;
}

export const PLATAFORMA_FEATURES: PlataformaFeature[] = [
  {
    title: "Plataforma de Ensino",
    description:
      "Player rápido, materiais por aula e seu progresso salvo em qualquer dispositivo.",
    icon: "MonitorPlay",
  },
  {
    title: "Cursos por Trilhas e Formações",
    description:
      "Um caminho definido do primeiro HTML ao deploy, sem você adivinhar o próximo passo.",
    icon: "Route",
  },
  {
    title: "Comunidade de alunos",
    description:
      "Canais por formação, dúvidas respondidas em minutos e networking que vira indicação.",
    icon: "MessagesSquare",
  },
  {
    title: "Club Agents",
    description:
      "Agentes de IA treinados no método da escola para revisar código e destravar bug.",
    icon: "Sparkles",
  },
  {
    title: "Playground de Treinamento",
    description:
      "Desafios de código no navegador, com correção automática e nível progressivo.",
    icon: "TerminalSquare",
  },
  {
    title: "Mural da Fama",
    description:
      "Os alunos destaque do mês em evidência, com o projeto e a contratação que conquistaram.",
    icon: "Trophy",
  },
];
