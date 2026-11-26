import type { MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "@/components/layout/file.svg";
import { isNavItemActive, siteNav } from "@/components/site/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LandingLink } from "./LandingLink";

function BrandLink() {
  return (
    <LandingLink className="brand" to="/#top" aria-label="UniMARKY home">
      <img src={logo} alt="UniMARKY" className="brand-logo" draggable={false} />
    </LandingLink>
  );
}

function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

export function SiteNavigation() {
  const { pathname, hash } = useLocation();
  const { session } = useAuth();

  const accountLinks = session
    ? [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Profile", to: "/profile" },
      ]
    : [
        { label: "Log in", to: "/auth" },
        { label: "Sign up", to: "/auth" },
      ];

  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <BrandLink />
        <span className="side-label">CAMPUS LIFE</span>
        <nav className="side-nav">
          {siteNav.map((item, index) => {
            const active = isNavItemActive(item.to, pathname, hash);
            return (
              <LandingLink
                key={item.label}
                to={item.to}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav-index">0{index + 1}</span>
                {item.label}
              </LandingLink>
            );
          })}
        </nav>
        <div className="side-bottom">
          {accountLinks.map((link) => (
            <LandingLink key={link.label} to={link.to}>
              {link.label} <ArrowUpRight size={14} />
            </LandingLink>
          ))}
        </div>
      </aside>

      <header className="mobile-header">
        <BrandLink />
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <Menu size={21} />
            <X size={21} />
          </summary>
          <nav>
            {siteNav.map((item) => (
              <LandingLink
                key={item.label}
                to={item.to}
                onClick={closeMenu}
              >
                {item.label}
                <ArrowUpRight size={14} />
              </LandingLink>
            ))}
            {accountLinks.map((link) => (
              <LandingLink key={link.label} to={link.to} onClick={closeMenu}>
                {link.label}
              </LandingLink>
            ))}
          </nav>
        </details>
      </header>
    </>
  );
}
