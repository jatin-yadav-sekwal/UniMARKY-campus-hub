import { SiteLink } from "./SiteLink";

export interface FooterLink {
  label: string;
  to: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <nav aria-label={title} className="min-w-0">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-um-ink-3">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <SiteLink
              to={link.to}
              className="inline-block text-[13.5px] leading-snug text-um-ink-2 transition-colors duration-150 hover:text-um-ink"
            >
              {link.label}
            </SiteLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
