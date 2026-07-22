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

export type FormacaoNivel = "Iniciante" | "Intermediário" | "Avançado";

export interface Formacao {
  name: string;
  description: string;
  icon: FormacaoIcon;
  nivel: FormacaoNivel;
  cargaHoraria: string;
  tags: string[];
  resultado: string;
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
      {
        name: "Front End",
        description: "As interfaces que as pessoas usam todo dia.",
        icon: "Layout",
        nivel: "Iniciante",
        cargaHoraria: "120h",
        tags: ["HTML", "CSS", "JavaScript"],
        resultado: "Você monta 3 interfaces reais no portfólio.",
      },
      {
        name: "Back End",
        description: "Servidores, APIs e banco de dados.",
        icon: "Server",
        nivel: "Intermediário",
        cargaHoraria: "140h",
        tags: ["Node.js", "SQL", "APIs"],
        resultado: "Você publica uma API completa em produção.",
      },
      {
        name: "Full Stack",
        description: "As duas pontas do produto na sua mão.",
        icon: "Layers",
        nivel: "Avançado",
        cargaHoraria: "220h",
        tags: ["React", "Node.js", "PostgreSQL"],
        resultado: "Você entrega um produto ponta a ponta sozinho.",
      },
      {
        name: "Mobile",
        description: "Aplicativos para iOS e Android.",
        icon: "Smartphone",
        nivel: "Intermediário",
        cargaHoraria: "130h",
        tags: ["React Native", "Expo", "TypeScript"],
        resultado: "Você lança um app nas lojas iOS e Android.",
      },
      {
        name: "React",
        description: "A biblioteca mais pedida nas vagas.",
        icon: "Atom",
        glow: "#61dafb",
        nivel: "Intermediário",
        cargaHoraria: "90h",
        tags: ["React", "Hooks", "Next.js"],
        resultado: "Você domina a lib mais pedida nas vagas.",
      },
      {
        name: "Node",
        description: "JavaScript rodando no servidor.",
        icon: "Hexagon",
        glow: "#3c873a",
        nivel: "Intermediário",
        cargaHoraria: "80h",
        tags: ["Node.js", "Express", "JWT"],
        resultado: "Você sustenta o back-end de um app real.",
      },
      {
        name: "JavaScript",
        description: "A linguagem que move a web.",
        icon: "Braces",
        glow: "#f7df1e",
        nivel: "Iniciante",
        cargaHoraria: "70h",
        tags: ["JavaScript", "ES6", "DOM"],
        resultado: "Você programa a lógica que move a web.",
      },
      {
        name: "HTML5",
        description: "A estrutura por trás de tudo.",
        icon: "FileCode2",
        glow: "#e34f26",
        nivel: "Iniciante",
        cargaHoraria: "40h",
        tags: ["HTML5", "Semântica"],
        resultado: "Você estrutura qualquer página do zero.",
      },
      {
        name: "CSS3",
        description: "Layout, estilo e responsividade.",
        icon: "Palette",
        glow: "#264de4",
        nivel: "Iniciante",
        cargaHoraria: "50h",
        tags: ["CSS3", "Flexbox", "Grid"],
        resultado: "Você recria qualquer layout com responsividade.",
      },
    ],
  },
  {
    number: "02",
    name: "IA & Automação",
    items: [
      {
        name: "Gestor de IA",
        description: "Liderar times e processos com IA.",
        icon: "BrainCircuit",
        nivel: "Avançado",
        cargaHoraria: "60h",
        tags: ["IA", "Gestão", "Processos"],
        resultado: "Você lidera a adoção de IA em um time.",
      },
      {
        name: "IA e Automações",
        description: "Fluxos que trabalham enquanto você dorme.",
        icon: "Bot",
        nivel: "Intermediário",
        cargaHoraria: "80h",
        tags: ["OpenAI", "n8n", "APIs"],
        resultado: "Você automatiza um processo de ponta a ponta.",
      },
      {
        name: "Claude & ClaudeCode",
        description: "Programar lado a lado com agentes.",
        icon: "Terminal",
        nivel: "Intermediário",
        cargaHoraria: "45h",
        tags: ["Claude", "Agentes", "MCP"],
        resultado: "Você programa junto com agentes de IA.",
      },
      {
        name: "Trilha N8N",
        description: "Automação visual sem limite.",
        icon: "Workflow",
        glow: "#ea4b71",
        nivel: "Iniciante",
        cargaHoraria: "55h",
        tags: ["n8n", "Webhooks", "APIs"],
        resultado: "Você cria automações sem escrever código.",
      },
    ],
  },
  {
    number: "03",
    name: "Dados",
    items: [
      {
        name: "Análise de Dados",
        description: "Do dado bruto à decisão de negócio.",
        icon: "BarChart3",
        nivel: "Intermediário",
        cargaHoraria: "110h",
        tags: ["Python", "Pandas", "SQL"],
        resultado: "Você vira dado bruto em decisão de negócio.",
      },
      {
        name: "PowerBI",
        description: "Dashboards que convencem a diretoria.",
        icon: "PieChart",
        glow: "#f2c811",
        nivel: "Iniciante",
        cargaHoraria: "60h",
        tags: ["Power BI", "DAX"],
        resultado: "Você monta dashboards que convencem a diretoria.",
      },
    ],
  },
];
