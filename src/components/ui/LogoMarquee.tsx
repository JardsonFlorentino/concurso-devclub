import Image from "next/image";
import { COMPANIES, COMPANIES_TITLE, type Company } from "@/data/companies";


const BASE_LOGO_HEIGHT = 26;

const ROW_HEIGHT = 68;

function CompanyLogo({ company }: { company: Company }) {
  if (!company.logo) {
    return (
      <span className="logo-mark whitespace-nowrap text-sm font-semibold tracking-wide text-white-light">
        {company.name}
      </span>
    );
  }

  return (
    <Image
      src={company.logo}
      alt={company.name}
      width={160}
      height={40}
      unoptimized
      loading="eager"
      className="logo-mark w-auto max-w-none"
      style={{ height: BASE_LOGO_HEIGHT * (company.scale ?? 1) }}
    />
  );
}


export function LogoMarquee() {
  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
        {COMPANIES_TITLE}
      </p>

      <div
        className="group relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]"
          style={{ height: ROW_HEIGHT }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-14"
              aria-hidden={copy === 1}
            >
              {COMPANIES.map((company) => (
                <CompanyLogo key={company.name} company={company} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
