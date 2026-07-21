import Image from "next/image";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { BRAND_LOGO, BRAND_NAME } from "@/data/navigation";
import {
  FOOTER_COLUMNS,
  FOOTER_SIGNATURE,
  FOOTER_SOCIAL,
  FOOTER_TAGLINE,
} from "@/data/footer";

export function FooterSection() {
  return (
    <footer
      id="footer"
      className="relative border-t border-white/10 bg-background-deep pb-12 pt-[100px]"
    >
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-3">
              <Image
                src={BRAND_LOGO}
                alt={BRAND_NAME}
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
              />
              <span className="text-[1.125rem] font-semibold tracking-[-0.01em] text-white-light">
                {BRAND_NAME}
              </span>
            </span>
            <p className="max-w-[34ch] text-sm leading-relaxed text-gray-300">
              {FOOTER_TAGLINE}
            </p>

            <ul className="mt-1 flex flex-wrap gap-3">
              {FOOTER_SOCIAL.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent-1/45 hover:text-accent-1"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white-light">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm text-gray-300 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent-1"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-16 border-t border-white/10 pt-8 text-sm text-gray-500">
          {FOOTER_SIGNATURE}
        </p>
      </div>
    </footer>
  );
}
