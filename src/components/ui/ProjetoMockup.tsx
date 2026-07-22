import type { Projeto } from "@/data/projetos";

const BAR_HEIGHTS = [42, 66, 50, 84, 58, 92];
const THUMBS = [0, 1, 2, 3, 4, 5, 6, 7];
const ROWS = [0, 1, 2];
const CELLS = [0, 1, 2, 3, 4, 5];

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-white/[0.08] px-3 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/[0.18]" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/[0.12]" />
        <span className="ml-2 h-2.5 flex-1 rounded-full bg-white/[0.07]" />
      </div>
      <div className="flex-1 p-3">{children}</div>
    </div>
  );
}

export function ProjetoMockup({ projeto }: { projeto: Projeto }) {
  const accent =
    projeto.tone === "accent-1" ? "bg-accent-1/60" : "bg-accent-2/70";
  const accentSoft =
    projeto.tone === "accent-1" ? "bg-accent-1/20" : "bg-accent-2/25";
  const accentLine =
    projeto.tone === "accent-1" ? "border-accent-1/40" : "border-accent-2/45";

  if (projeto.mockup === "dashboard") {
    return (
      <Chrome>
        <div className="flex h-full flex-col gap-2.5">
          <div className="flex flex-1 items-end gap-1.5">
            {BAR_HEIGHTS.map((height, index) => (
              <span
                key={height}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-[3px] ${
                  index === 3 ? accent : "bg-white/[0.13]"
                }`}
              />
            ))}
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            <span className="h-1.5 w-full rounded-full bg-white/[0.09]" />
            <span className="h-1.5 w-4/5 rounded-full bg-white/[0.07]" />
            <span className="h-1.5 w-3/5 rounded-full bg-white/[0.05]" />
          </div>
        </div>
      </Chrome>
    );
  }

  if (projeto.mockup === "delivery") {
    return (
      <Chrome>
        <div className="flex h-full flex-col gap-1.5">
          {ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center gap-2 rounded-[6px] border border-white/[0.07] bg-white/[0.03] p-1.5"
            >
              <span className="h-5 w-5 shrink-0 rounded-[4px] bg-white/[0.12]" />
              <span className="flex flex-1 flex-col gap-1">
                <span className="h-1.5 w-3/5 rounded-full bg-white/[0.14]" />
                <span className="h-1.5 w-2/5 rounded-full bg-white/[0.07]" />
              </span>
            </div>
          ))}
          <span className={`mt-auto h-5 shrink-0 rounded-full ${accent}`} />
        </div>
      </Chrome>
    );
  }

  if (projeto.mockup === "ecommerce") {
    return (
      <Chrome>
        <div className="flex h-full gap-2.5">
          <div className="flex w-[22%] shrink-0 flex-col gap-1.5">
            <span className={`h-2 w-full rounded-full ${accentSoft}`} />
            <span className="h-1.5 w-4/5 rounded-full bg-white/[0.1]" />
            <span className="h-1.5 w-full rounded-full bg-white/[0.07]" />
            <span className="h-1.5 w-3/5 rounded-full bg-white/[0.07]" />
          </div>
          <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-1.5">
            {CELLS.map((cell) => (
              <span
                key={cell}
                className="rounded-[5px] border border-white/[0.07] bg-white/[0.05]"
              />
            ))}
          </div>
        </div>
      </Chrome>
    );
  }

  if (projeto.mockup === "automation") {
    return (
      <Chrome>
        <div className="relative h-full">
          <span className="absolute left-0 top-[34%] h-[32%] w-[28%] rounded-[5px] border border-white/[0.12] bg-white/[0.05]" />
          <span
            className={`absolute left-[36%] top-[8%] h-[32%] w-[28%] rounded-[5px] border ${accentLine} ${accentSoft}`}
          />
          <span className="absolute left-[36%] top-[60%] h-[32%] w-[28%] rounded-[5px] border border-white/[0.12] bg-white/[0.05]" />
          <span className="absolute left-[72%] top-[34%] h-[32%] w-[28%] rounded-[5px] border border-white/[0.12] bg-white/[0.05]" />

          <span className="absolute left-[28%] top-[50%] h-px w-[4%] bg-white/20" />
          <span className="absolute left-[32%] top-[24%] h-[52%] w-px bg-white/20" />
          <span className="absolute left-[32%] top-[24%] h-px w-[4%] bg-white/20" />
          <span className="absolute left-[32%] top-[76%] h-px w-[4%] bg-white/20" />
          <span className="absolute left-[64%] top-[24%] h-px w-[4%] bg-white/20" />
          <span className="absolute left-[64%] top-[76%] h-px w-[4%] bg-white/20" />
          <span className="absolute left-[68%] top-[24%] h-[52%] w-px bg-white/20" />
          <span className="absolute left-[68%] top-[50%] h-px w-[4%] bg-white/20" />
        </div>
      </Chrome>
    );
  }

  if (projeto.mockup === "chat") {
    return (
      <Chrome>
        <div className="flex h-full flex-col gap-1.5">
          <span className="h-4 w-[58%] rounded-[8px] rounded-bl-[2px] bg-white/[0.09]" />
          <span
            className={`h-4 w-[46%] self-end rounded-[8px] rounded-br-[2px] ${accent}`}
          />
          <span className="h-4 w-[64%] rounded-[8px] rounded-bl-[2px] bg-white/[0.09]" />
          <span
            className={`h-3.5 w-[34%] self-end rounded-[8px] rounded-br-[2px] ${accentSoft}`}
          />
          <span className="mt-auto h-5 shrink-0 rounded-full border border-white/[0.09] bg-white/[0.03]" />
        </div>
      </Chrome>
    );
  }

  return (
    <Chrome>
      <div className="flex h-full flex-col gap-2">
        <span
          className={`h-[44%] shrink-0 rounded-[6px] border border-white/[0.08] ${accentSoft}`}
        />
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {THUMBS.map((thumb) => (
            <span
              key={thumb}
              className="rounded-[4px] border border-white/[0.06] bg-white/[0.06]"
            />
          ))}
        </div>
      </div>
    </Chrome>
  );
}
