import { ArrowUpRight, Instagram } from "lucide-react";
import { Brand } from "./Brand";
import { FooterColumn } from "./FooterColumn";
import { SiteButton } from "./SiteButton";
import { SiteLink } from "./SiteLink";

const exploreLinks = [
  { label: "Ecosystem", to: "/#ecosystem" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Community", to: "/communities" },
  { label: "Study", to: "/study" },
  { label: "Accommodation", to: "/housing" },
  { label: "Food", to: "/food" },
];

const resourceLinks = [
  { label: "FAQs", to: "/#faqs" },
  { label: "Help Center", to: "/contact" },
  { label: "User Guides", to: "/about" },
  { label: "Integration", to: "/#integration" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Mission", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Feedback", to: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full bg-white">
      <div className="um-container pb-6 pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.9fr]">
          {/* Brand */}
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <Brand imageClassName="h-7" />
            <p className="mt-5 text-[14px] leading-relaxed text-um-ink-2">
              The digital campus for verified students. Communities, marketplace,
              study, stays and food — in one place.
            </p>
            <SiteButton to="/auth" size="md" className="mt-6">
              Join UniMARKY
              <ArrowUpRight className="h-3.5 w-3.5" />
            </SiteButton>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Company" links={companyLinks} />

          <nav aria-label="Connect" className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-um-ink-3">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/unimarky/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="um-focus inline-flex items-center gap-2 rounded-md text-[13.5px] text-um-ink-2 transition-colors duration-150 hover:text-um-ink"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Legal / bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-um-line pt-6 text-[11.5px] text-um-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} UniMARKY. Built for students.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <SiteLink to="/privacy" className="transition-colors duration-150 hover:text-um-ink">
              Privacy Policy
            </SiteLink>
            <SiteLink to="/terms" className="transition-colors duration-150 hover:text-um-ink">
              Terms &amp; Conditions
            </SiteLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
