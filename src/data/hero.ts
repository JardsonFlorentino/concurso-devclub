/** Conteúdo do hero. Fora do JSX para que texto e marcação evoluam separados. */

export const HERO_BADGE = "A escola das profissões do futuro";

export const HERO_HEADLINE = "Transforme sua carreira com";

export const HERO_ROLES = ["Full Stack", "Front-End", "Back-End"];

export const HERO_PARAGRAPH =
  "Do primeiro if ao primeiro contrato. Método, projeto real e uma comunidade que não te deixa parar no meio.";

export const HERO_CTA = { label: "Ver formações", href: "#formacoes" };

export interface Avatar {
  initials: string;
  label: string;
  photo?: string;
}

export const HERO_SOCIAL_PROOF: {
  count: string;
  text: string;
  avatars: Avatar[];
} = {
  count: "+25 mil",
  text: "alunos já passaram por aqui",
  avatars: [
    { initials: "MR", label: "Marina Rocha", photo: "/alunos/testimonial-1.jpg" },
    { initials: "TS", label: "Thiago Souza", photo: "/alunos/testimonial-2.jpg" },
    { initials: "CL", label: "Camila Lima", photo: "/alunos/testimonial-3.jpg" },
  ],
};

export const TYPEWRITER_TIMING = {
  typeMs: 85,
  deleteMs: 45,
  pauseMs: 1500,
};
