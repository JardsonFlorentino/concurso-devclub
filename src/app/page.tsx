import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { FormacoesSection } from "@/components/sections/FormacoesSection";
import { TecnologiasSection } from "@/components/sections/TecnologiasSection";
import { AlemDoCodigoSection } from "@/components/sections/AlemDoCodigoSection";
import { PlataformaSection } from "@/components/sections/PlataformaSection";
import { ProjetosSection } from "@/components/sections/ProjetosSection";
import { ComunidadeSection } from "@/components/sections/ComunidadeSection";
import { TutoresSection } from "@/components/sections/TutoresSection";
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
      {PENDING_SECTIONS.map((section) => (
        <SectionPlaceholder key={section.id} section={section} />
      ))}
    </main>
  );
}
