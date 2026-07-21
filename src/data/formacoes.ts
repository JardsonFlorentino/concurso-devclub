export const FORMACOES_TITLE = {
  before: "Formações completas para aprender tudo do ",
  firstHighlight: "ZERO",
  middle: " ao ",
  secondHighlight: "Avançado",
};

export const FORMACOES_ALL_LABEL = "Todos";

export type FormacaoIcon =
  | "Layout"
  | "Server"
  | "Layers"
  | "Smartphone"
  | "Atom"
  | "Hexagon"
  | "Braces"
  | "FileCode2"
  | "Palette"
  | "BrainCircuit"
  | "Bot"
  | "Terminal"
  | "Workflow"
  | "BarChart3"
  | "PieChart";

export interface Formacao {
  name: string;
  description: string;
  icon: FormacaoIcon;
  logo?: string;
  glow?: string;
}

export interface FormacaoCategory {
  number: string;
  name: string;
  items: Formacao[];
}

export const FORMACAO_CATEGORIES: FormacaoCategory[] = [
  {
    number: "01",
    name: "Programação",
    items: [
      { name: "Front End", description: "As interfaces que as pessoas usam todo dia", icon: "Layout" },
      { name: "Back End", description: "Servidores, APIs e banco de dados", icon: "Server" },
      { name: "Full Stack", description: "As duas pontas do produto na sua mão", icon: "Layers" },
      { name: "Mobile", description: "Aplicativos para iOS e Android", icon: "Smartphone" },
      { name: "React", description: "A biblioteca mais pedida nas vagas", icon: "Atom", glow: "#61dafb" },
      { name: "Node", description: "JavaScript rodando no servidor", icon: "Hexagon", glow: "#3c873a" },
      { name: "JavaScript", description: "A linguagem que move a web", icon: "Braces", glow: "#f7df1e" },
      { name: "HTML5", description: "A estrutura por trás de tudo", icon: "FileCode2", glow: "#e34f26" },
      { name: "CSS3", description: "Layout, estilo e responsividade", icon: "Palette", glow: "#264de4" },
    ],
  },
  {
    number: "02",
    name: "IA & Automação",
    items: [
      { name: "Gestor de IA", description: "Liderar times e processos com IA", icon: "BrainCircuit" },
      { name: "IA e Automações", description: "Fluxos que trabalham enquanto você dorme", icon: "Bot" },
      { name: "Claude & ClaudeCode", description: "Programar lado a lado com agentes", icon: "Terminal" },
      { name: "Trilha N8N", description: "Automação visual sem limite", icon: "Workflow", glow: "#ea4b71" },
    ],
  },
  {
    number: "03",
    name: "Dados",
    items: [
      { name: "Análise de Dados", description: "Do dado bruto à decisão de negócio", icon: "BarChart3" },
      { name: "PowerBI", description: "Dashboards que convencem a diretoria", icon: "PieChart", glow: "#f2c811" },
    ],
  },
];
