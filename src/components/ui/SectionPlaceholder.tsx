import type { SectionMeta } from "@/data/sections";


export function SectionPlaceholder({ section }: { section: SectionMeta }) {
  return (
    <section
      id={section.id}
      data-cursor={section.cursorZone}
      className="flex min-h-[60vh] items-center justify-center border-b border-white/5 px-6 py-[120px]"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-accent-1">
          {section.id}
        </span>
        <h2 className="text-4xl font-semibold text-gray-400 md:text-6xl">
          {section.label}
        </h2>
      </div>
    </section>
  );
}
