import { ArrowRight, ArrowUpRight, Instagram } from "lucide-react";
import logo from "@/components/layout/file.svg";
import { siteNav } from "@/components/site/navigation";
import { LandingLink } from "./LandingLink";

interface FooterLink {
  label: string;
  to: string;
}

const resourceLinks: FooterLink[] = [
  { label: "FAQs", to: "/#faqs" },
  { label: "Help center", to: "/contact" },
  { label: "Study guides", to: "/study" },
  { label: "Integration", to: "/#integration" },
  { label: "Documentation", to: "/about" },
];

const companyLinks: FooterLink[] = [
  { label: "About us", to: "/about" },
  { label: "Our mission", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Feedback", to: "/contact" },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="footer-col">
      <h3>{title}</h3>
      {links.map((link) => (
        <LandingLink key={link.label} to={link.to}>
          {link.label}
        </LandingLink>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <LandingLink className="brand" to="/#top" aria-label="UniMARKY home">
            <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
          </LandingLink>
          <p>Student services in one place.</p>
          <LandingLink className="footer-cta" to="/auth">
            Find your place <ArrowRight size={15} />
          </LandingLink>
        </div>

        <FooterColumn title="EXPLORE" links={siteNav.slice(0, 6)} />
        <FooterColumn title="RESOURCES" links={resourceLinks} />
        <FooterColumn title="COMPANY" links={companyLinks} />

        <div className="footer-col">
          <h3>CONNECT</h3>
          <a
            href="https://www.instagram.com/unimarky/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram <ArrowUpRight size={12} />
          </a>
          <LandingLink to="/contact">Contact</LandingLink>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Unimarky. Built around student life.</span>
        <div>
          <LandingLink to="/privacy">Privacy</LandingLink>
          <LandingLink to="/terms">Terms</LandingLink>
          <span>Designed for wherever you study.</span>
        </div>
      </div>
    </footer>
  );
}
