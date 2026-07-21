import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { FormacoesSection } from "@/components/sections/FormacoesSection";
import { TecnologiasSection } from "@/components/sections/TecnologiasSection";
import { AlemDoCodigoSection } from "@/components/sections/AlemDoCodigoSection";
import { PlataformaSection } from "@/components/sections/PlataformaSection";
import { ProjetosSection } from "@/components/sections/ProjetosSection";
import { ComunidadeSection } from "@/components/sections/ComunidadeSection";
import { TutoresSection } from "@/components/sections/TutoresSection";
import { BonusSection } from "@/components/sections/BonusSection";
import { MecSection } from "@/components/sections/MecSection";
import { MercadoSection } from "@/components/sections/MercadoSection";
import { SectionPlaceholder } from "@/components/ui/SectionPlaceholder";
import { SECTIONS } from "@/data/sections";


const BUILT_SECTIONS = new Set([
  "hero",
  "manifesto",
  "formacoes",
  "tecnologias",
  "alem-do-codigo",
  "plataforma",
  "projetos",
  "comunidade",
  "tutores",
  "bonus",
  "mec",
  "mercado",
]);

const PENDING_SECTIONS = SECTIONS.filter((section) => !BUILT_SECTIONS.has(section.id));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <FormacoesSection />
      <TecnologiasSection />
      <AlemDoCodigoSection />
      <PlataformaSection />
      <ProjetosSection />
      <ComunidadeSection />
      <TutoresSection />
      <BonusSection />
      <MecSection />
      <MercadoSection />
      {PENDING_SECTIONS.map((section) => (
        <SectionPlaceholder key={section.id} section={section} />
      ))}
    </main>
  );
}
