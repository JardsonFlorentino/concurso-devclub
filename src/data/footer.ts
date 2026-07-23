export const CTA_HEADLINE = "Bora ser DEV?";

export const CTA_SUBTITLE =
  "A próxima turma começa agora. O primeiro passo é o mesmo pra todo mundo: decidir.";

export const CTA_BUTTON = {
  label: "Quero ser aluno",
  href: "https://api.whatsapp.com/send/?phone=5516990482444&text=quero%20me%20matricular&type=phone_number&app_absent=0",
};

export type SocialIcon = "Instagram" | "Youtube" | "Linkedin" | "Github";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Formações",
    links: [
      { label: "Full Stack", href: "#formacoes" },
      { label: "Front-End", href: "#formacoes" },
      { label: "Back-End", href: "#formacoes" },
      { label: "IA e Dados", href: "#formacoes" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Quem somos", href: "#manifesto" },
      { label: "Tutores", href: "#tutores" },
      { label: "Diplomas e MEC", href: "#mec" },
      { label: "Perguntas frequentes", href: "#faq" },
    ],
  },
  {
    title: "Alunos",
    links: [
      { label: "Área do aluno", href: "https://aulas.devclub.com.br/", external: true },
      { label: "Comunidade", href: "#comunidade" },
      { label: "Projetos", href: "#projetos" },
      { label: "Módulos bônus", href: "#bonus" },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const FOOTER_SOCIAL: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/devclubescola", icon: "Instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@canaldevclub", icon: "Youtube" },
  { label: "LinkedIn", href: "https://www.linkedin.com/school/dev-club-devs/", icon: "Linkedin" },
  { label: "GitHub", href: "https://github.com", icon: "Github" },
];

export const FOOTER_TAGLINE =
  "A escola que forma desenvolvedores que o mercado disputa.";

export const FOOTER_SIGNATURE = {
  before: "Concursos DevClub · Criado por ",
  authorName: "Jardson Florentino",
  authorUrl: "https://www.jardsonflorentino.com.br",
  after: " · © DevClub 2026",
};