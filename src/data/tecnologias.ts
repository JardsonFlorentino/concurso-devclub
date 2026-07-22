export const TECNOLOGIAS_TITLE = {
  before: "Aprenda as ",
  highlight: "PRINCIPAIS Tecnologias",
  after: " do Mercado",
};

export const TECNOLOGIAS_SUBTITLE =
  "Do zero, de forma didática, com quem já construiu software de verdade.";

export type TecnologiaRing = "outer" | "inner";

export interface Tecnologia {
  name: string;
  ring: TecnologiaRing;
  logo?: string;
  invert?: boolean;
  scale?: number;
}

export const TECNOLOGIAS: Tecnologia[] = [
  { name: "HTML5", ring: "outer", logo: "/tech/html5.svg" },
  { name: "CSS3", ring: "outer", logo: "/tech/css3.svg" },
  { name: "JavaScript", ring: "outer", logo: "/tech/javascript.svg", scale: 0.9 },
  { name: "TypeScript", ring: "outer", logo: "/tech/typescript.svg", scale: 0.9 },
  { name: "React", ring: "outer", logo: "/tech/react.svg", invert: true, scale: 1.45 },
  { name: "Node.js", ring: "outer", logo: "/tech/nodejs.svg" },
  { name: "Python", ring: "outer", logo: "/tech/python.svg" },
  { name: "Docker", ring: "outer", logo: "/tech/docker.svg", scale: 1.15 },
  { name: "Git", ring: "outer", logo: "/tech/git.svg" },
  { name: "GitHub", ring: "outer", logo: "/tech/github.svg", invert: true },
  { name: "Next.js", ring: "outer", logo: "/tech/nextjs.svg", scale: 0.92 },
  { name: "PostgreSQL", ring: "outer", logo: "/tech/postgresql.svg", scale: 1.45 },

  { name: "Tailwind CSS", ring: "inner", logo: "/tech/tailwindcss.svg", scale: 1.25 },
  { name: "Vite", ring: "inner", logo: "/tech/vite.svg" },
  { name: "Prisma", ring: "inner", logo: "/tech/prisma.svg", invert: true, scale: 0.95 },
  { name: "Drizzle ORM", ring: "inner", logo: "/tech/drizzle.svg", invert: true, scale: 1.15 },
  { name: "Express", ring: "inner", logo: "/tech/expressjs.svg", invert: true, scale: 1.3 },
  { name: "Fastify", ring: "inner", logo: "/tech/fastify.svg", invert: true, scale: 1.2 },
  { name: "Redis", ring: "inner", logo: "/tech/redis.svg", scale: 1.05 },
  { name: "n8n", ring: "inner", logo: "/tech/n8n.svg", invert: true, scale: 1.45 },
  { name: "OpenAI", ring: "inner", logo: "/tech/openai.svg", invert: true, scale: 1.45 },
  { name: "LangChain", ring: "inner", logo: "/tech/langchain.svg", scale: 1.05 },
  { name: "Pandas", ring: "inner" },
];
