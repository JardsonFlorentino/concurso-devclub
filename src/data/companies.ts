export interface Company {
  name: string;
  logo?: string;  
  scale?: number;
}

export const COMPANIES_TITLE = "Alunos contratados por empresas como";


export const COMPANIES: Company[] = [
  { name: "Google", logo: "/logos/google-logo.svg", scale: 0.95 },
  { name: "Amazon", logo: "/logos/Amazon_logo_plain.svg", scale: 1 },
  { name: "iFood", logo: "/logos/ifood-logo.svg", scale: 2.3 },
  { name: "Mercado Livre", logo: "/logos/mercado-livre-logo-2022.svg", scale: 2.3 },
  { name: "Spotify", logo: "/logos/spotify-logo.svg", scale: 2.3 },
  { name: "Nubank", logo: "/logos/nubank-logo-2021.svg", scale: 2.3 },
  { name: "NVIDIA", logo: "/logos/nvidia-logo.svg", scale: 1 },
  { name: "Shopify", logo: "/logos/shopify-logo.svg", scale: 2.3 },
  { name: "TOTVS", logo: "/logos/totvs-logo.svg", scale: 2.3 },
  { name: "Uber", logo: "/logos/uber-logo.svg", scale: 0.85 },
  { name: "Meta", logo: "/logos/meta-logo.svg", scale: 2.3 },
];
