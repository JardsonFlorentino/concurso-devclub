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
import { GarantiaSection } from "@/components/sections/GarantiaSection";
import { ReembolsoSection } from "@/components/sections/ReembolsoSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <>
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
        <GarantiaSection />
        <ReembolsoSection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </>
  );
}
