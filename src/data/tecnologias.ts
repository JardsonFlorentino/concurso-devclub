export const TECNOLOGIAS_TITLE = {
  before: "Aprenda as ",
  highlight: "PRINCIPAIS Tecnologias",
  after: " do Mercado",
};

export const TECNOLOGIAS_SUBTITLE =
  "Do zero, de forma didática, com quem já construiu software de verdade.";

export interface Tecnologia {
  name: string;
  logo?: string;
  invert?: boolean;
  scale?: number;
}

export const TECNOLOGIAS: Tecnologia[] = [
  { name: "HTML5", logo: "/tech/html5.svg" },
  { name: "CSS3", logo: "/tech/css3.svg" },
  { name: "JavaScript", logo: "/tech/javascript.svg", scale: 0.9 },
  { name: "TypeScript", logo: "/tech/typescript.svg", scale: 0.9 },
  { name: "React", logo: "/tech/react.svg", invert: true, scale: 1.45 },
  { name: "Node.js", logo: "/tech/nodejs.svg" },
  { name: "PostgreSQL", logo: "/tech/postgreSQL.svg", scale: 1.45 },
  { name: "Docker", logo: "/tech/docker.svg", scale: 1.15 },
  { name: "Git", logo: "/tech/git.svg" },
  { name: "GitHub", logo: "/tech/github.svg", invert: true },
  { name: "Python", logo: "/tech/python.svg" },
  { name: "n8n", logo: "/tech/n8n.svg", invert: true, scale: 1.45 },
  { name: "OpenAI", logo: "/tech/openai.svg", invert: true, scale: 1.45 },
  { name: "LangChain", logo: "/tech/langchain.svg", scale: 1.05 },
  { name: "Pandas" },
  { name: "Next.js", logo: "/tech/nextjs.svg", scale: 0.92 },
  { name: "Tailwind CSS", logo: "/tech/tailwindcss.svg", scale: 1.25 },
  { name: "Vite", logo: "/tech/vite.svg" },
  { name: "Prisma", logo: "/tech/prisma.svg", invert: true, scale: 0.95 },
  { name: "Drizzle ORM", logo: "/tech/drizzle.svg", invert: true, scale: 1.15 },
  { name: "Express", logo: "/tech/expressjs.svg", invert: true, scale: 1.3 },
  { name: "Fastify", logo: "/tech/fastify.svg", invert: true, scale: 1.2 },
  { name: "Redis", logo: "/tech/redis.svg", scale: 1.05 },
];
