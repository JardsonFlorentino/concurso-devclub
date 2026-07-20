import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { SectionPlaceholder } from "@/components/ui/SectionPlaceholder";
import { SECTIONS } from "@/data/sections";


const BUILT_SECTIONS = new Set(["hero", "manifesto"]);

const PENDING_SECTIONS = SECTIONS.filter((section) => !BUILT_SECTIONS.has(section.id));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      {PENDING_SECTIONS.map((section) => (
        <SectionPlaceholder key={section.id} section={section} />
      ))}
    </main>
  );
}
