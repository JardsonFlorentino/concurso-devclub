import { HeroSection } from "@/components/sections/HeroSection";
import { SectionPlaceholder } from "@/components/ui/SectionPlaceholder";
import { SECTIONS } from "@/data/sections";


const PENDING_SECTIONS = SECTIONS.filter((section) => section.id !== "hero");

export default function Home() {
  return (
    <main>
      <HeroSection />
      {PENDING_SECTIONS.map((section) => (
        <SectionPlaceholder key={section.id} section={section} />
      ))}
    </main>
  );
}
