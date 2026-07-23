import { Play } from "lucide-react";
import type { PlataformaMockupKind } from "@/data/plataforma";

const STEPS = [0, 1, 2, 3, 4];
const LESSONS = [0, 1, 2, 3];
const CODE_LINES = [
  { indent: 0, width: "62%", accent: false },
  { indent: 1, width: "78%", accent: true },
  { indent: 1, width: "54%", accent: false },
  { indent: 2, width: "68%", accent: false },
  { indent: 1, width: "44%", accent: false },
  { indent: 0, width: "36%", accent: false },
];
const EDITOR_LINES = [
  { width: "70%", indent: 0 },
  { width: "52%", indent: 1 },
  { width: "84%", indent: 1 },
  { width: "40%", indent: 2 },
  { width: "60%", indent: 1 },
  { width: "30%", indent: 0 },
];
const PODIUM = [
  { height: "58%", delay: 0 },
  { height: "88%", delay: 1 },
  { height: "44%", delay: 2 },
];

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-white/20 bg-white/[0.06] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-white/60" />
        <span className="h-2 w-2 rounded-full bg-white/45" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="ml-3 h-3 w-1/3 rounded-full border border-white/20 bg-white/20" />
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

export function PlataformaMockup({ kind }: { kind: PlataformaMockupKind }) {
  if (kind === "trilhas") {
    return (
      <Frame>
        <div className="flex h-full flex-col justify-center gap-3 px-2">
          {STEPS.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                {step < STEPS.length - 1 ? (
                  <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-white/30" />
                ) : null}
                <span
                  className={`h-7 w-7 rounded-full border ${
                    step <= 1
                      ? "border-accent-1/70 bg-accent-1/40"
                      : "border-white/30 bg-white/[0.12]"
                  }`}
                />
              </span>
              <span className="flex flex-1 flex-col gap-1.5">
                <span
                  className={`h-2 rounded-full ${
                    step <= 1 ? "bg-accent-1/55" : "bg-white/35"
                  }`}
                  style={{ width: `${72 - step * 8}%` }}
                />
                <span className="h-1.5 w-1/3 rounded-full bg-white/20" />
              </span>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (kind === "comunidade") {
    return (
      <Frame>
        <div className="flex h-full flex-col justify-center gap-3">
          <div className="flex items-end gap-2">
            <span className="h-7 w-7 shrink-0 rounded-full bg-white/30" />
            <span className="h-9 w-[56%] rounded-[10px] rounded-bl-[3px] bg-white/[0.22]" />
          </div>
          <div className="flex items-end justify-end gap-2">
            <span className="h-8 w-[46%] rounded-[10px] rounded-br-[3px] bg-accent-1/45" />
            <span className="h-7 w-7 shrink-0 rounded-full bg-accent-1/50" />
          </div>
          <div className="flex items-end gap-2">
            <span className="h-7 w-7 shrink-0 rounded-full bg-white/30" />
            <span className="h-10 w-[64%] rounded-[10px] rounded-bl-[3px] bg-white/[0.22]" />
          </div>
          <div className="flex items-end justify-end gap-2">
            <span className="h-7 w-[34%] rounded-[10px] rounded-br-[3px] bg-accent-2/45" />
            <span className="h-7 w-7 shrink-0 rounded-full bg-accent-2/50" />
          </div>
        </div>
      </Frame>
    );
  }

  if (kind === "agents") {
    return (
      <Frame>
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-[6px] border border-accent-2/60 bg-accent-2/40" />
            <span className="h-2 w-[38%] rounded-full bg-white/40" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2.5 rounded-[8px] border border-white/15 bg-white/[0.06] p-4">
            {CODE_LINES.map((line, index) => (
              <span
                key={index}
                style={{
                  width: line.width,
                  marginLeft: `${line.indent * 14}px`,
                }}
                className={`h-2 rounded-full ${
                  line.accent ? "bg-accent-1/60" : "bg-white/35"
                }`}
              />
            ))}
          </div>
          <span className="h-8 w-[52%] rounded-full border border-accent-1/50 bg-accent-1/25" />
        </div>
      </Frame>
    );
  }

  if (kind === "playground") {
    return (
      <Frame>
        <div className="flex h-full gap-3">
          <div className="flex flex-[1.3] flex-col gap-2.5 rounded-[8px] border border-white/15 bg-white/[0.05] p-3">
            {EDITOR_LINES.map((line, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                <span
                  style={{
                    width: line.width,
                    marginLeft: `${line.indent * 10}px`,
                  }}
                  className="h-2 rounded-full bg-white/35"
                />
              </span>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-[8px] border border-accent-1/35 bg-accent-1/[0.12] p-3">
            <span className="h-2 w-3/4 rounded-full bg-accent-1/60" />
            <span className="h-2 w-1/2 rounded-full bg-white/30" />
            <span className="mt-auto h-7 w-full rounded-[6px] border border-accent-1/50 bg-accent-1/30" />
          </div>
        </div>
      </Frame>
    );
  }

  if (kind === "mural") {
    return (
      <Frame>
        <div className="flex h-full flex-col gap-3">
          <div className="flex flex-1 items-end justify-center gap-3">
            {PODIUM.map((bar) => (
              <span
                key={bar.height}
                style={{ height: bar.height }}
                className={`flex w-[22%] flex-col items-center justify-start gap-2 rounded-t-[8px] border-t border-x pt-3 ${
                  bar.delay === 1
                    ? "border-accent-1/60 bg-accent-1/30"
                    : "border-white/20 bg-white/[0.14]"
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full ${
                    bar.delay === 1 ? "bg-accent-1/60" : "bg-white/35"
                  }`}
                />
                <span className="h-1.5 w-2/3 rounded-full bg-white/30" />
              </span>
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            {LESSONS.map((card) => (
              <span
                key={card}
                className="h-8 flex-1 rounded-[6px] border border-white/15 bg-white/[0.12]"
              />
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="flex h-full gap-3">
        <div className="flex flex-[1.6] flex-col gap-2.5">
          <div className="relative flex flex-1 items-center justify-center rounded-[8px] border border-white/20 bg-white/[0.14]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-1/60 bg-accent-1/35">
              <Play
                size={16}
                strokeWidth={1.75}
                fill="currentColor"
                className="ml-0.5 text-white-light"
              />
            </span>
          </div>
          <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <span className="absolute inset-y-0 left-0 w-[42%] rounded-full bg-accent-1/70" />
            <span className="absolute left-[42%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-1" />
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-10 rounded-full bg-white/40" />
            <span className="ml-auto h-2 w-8 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {LESSONS.map((lesson) => (
            <span
              key={lesson}
              className={`flex items-center gap-2 rounded-[6px] border p-2 ${
                lesson === 1
                  ? "border-accent-1/50 bg-accent-1/20"
                  : "border-white/15 bg-white/[0.08]"
              }`}
            >
              <span
                className={`h-4 w-4 shrink-0 rounded-[3px] ${
                  lesson === 1 ? "bg-accent-1/60" : "bg-white/30"
                }`}
              />
              <span className="h-1.5 flex-1 rounded-full bg-white/30" />
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}
