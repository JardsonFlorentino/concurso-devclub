export interface NavLink {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Formações", href: "#formacoes" },
  { label: "Quem somos", href: "#manifesto" },
  { label: "Alunos", href: "#comunidade" },
  { label: "Tutores", href: "#tutores" },
];

export const HEADER_PRIMARY_CTA: NavLink = {
  label: "Quero ser aluno",
  href: "https://api.whatsapp.com/send/?phone=5516990482444&text=quero%20me%20matricular&type=phone_number&app_absent=0",
  target: "_blank",
  rel: "noopener noreferrer",
};

export const HEADER_SECONDARY_CTA: NavLink = {
  label: "Área do aluno",
  href: "https://aulas.devclub.com.br/",
  target: "_blank",
  rel: "noopener noreferrer",
};

export const BRAND_NAME = "DevClub";
export const BRAND_LOGO = "/logo.png";