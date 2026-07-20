import { SectionPlaceholder } from "@/components/ui/SectionPlaceholder";
import { SECTIONS } from "@/data/sections";

export default function Home() {
  return (
    <main>
      {SECTIONS.map((section) => (
        <SectionPlaceholder key={section.id} section={section} />
      ))}
    </main>
  );
}
