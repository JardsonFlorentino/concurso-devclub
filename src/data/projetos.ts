export const PROJETOS_TITLE = {
  before: "Tudo com ",
  highlight: "Projetos Práticos e Reais",
  after: "",
};

export const PROJETOS_SUBTITLE =
  "Você termina cada formação com portfólio publicado, não com certificado na gaveta.";

export type ProjetoTone = "accent-1" | "accent-2";

export type ProjetoMockupKind =
  | "streaming"
  | "dashboard"
  | "delivery"
  | "ecommerce"
  | "automation"
  | "chat";

export interface Projeto {
  name: string;
  description: string;
  stack: string[];
  tone: ProjetoTone;
  mockup: ProjetoMockupKind;
  image?: string;
}

export const PROJETOS: Projeto[] = [
  {
    name: "Clone de streaming",
    description:
      "Catálogo com busca, perfis e player contínuo, consumindo API própria.",
    stack: ["React", "Next.js", "TypeScript"],
    tone: "accent-1",
    mockup: "streaming",
  },
  {
    name: "Dashboard financeiro",
    description:
      "Painel de receitas e despesas com gráficos, filtros por período e exportação.",
    stack: ["React", "Node.js", "PostgreSQL"],
    tone: "accent-2",
    mockup: "dashboard",
  },
  {
    name: "App de delivery",
    description:
      "Carrinho, cálculo de frete e acompanhamento do pedido em tempo real.",
    stack: ["React Native", "Node.js", "SQL"],
    tone: "accent-1",
    mockup: "delivery",
  },
  {
    name: "E-commerce completo",
    description:
      "Vitrine, checkout com pagamento e painel administrativo de estoque.",
    stack: ["Next.js", "Stripe", "Prisma"],
    tone: "accent-2",
    mockup: "ecommerce",
  },
  {
    name: "Bot de automação",
    description:
      "Fluxo que lê planilha, dispara mensagem e registra resposta sem intervenção.",
    stack: ["Python", "n8n", "OpenAI"],
    tone: "accent-1",
    mockup: "automation",
  },
  {
    name: "Agente de atendimento",
    description:
      "Assistente que responde sobre a base de conhecimento da empresa com contexto.",
    stack: ["LangChain", "OpenAI", "Node.js"],
    tone: "accent-2",
    mockup: "chat",
  },
];
