import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/unimarky-logo.png";
import {
  hashTarget,
  isNavItemActive,
  landingSections,
  siteNav,
} from "@/components/site/navigation";
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
  const isLanding = pathname === "/";
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // On the landing page the sidebar is a section index: highlight the section
  // currently in view instead of a route. Other public pages keep the page nav.
  useEffect(() => {
    if (!isLanding) {
      setActiveSection(null);
      return;
    }

    const sections = landingSections
      .map((item) => {
        const id = hashTarget(item.to);
        return id ? document.getElementById(id) : null;
      })
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const update = () => {
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 140) current = section.id;
      }
      setActiveSection(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isLanding]);

  const items = isLanding ? landingSections : siteNav;

  const isActive = (to: string) => {
    if (!isLanding) return isNavItemActive(to, pathname, hash);
    const id = hashTarget(to);
    return id !== null && id === activeSection;
  };

  const currentAttr = (to: string): "page" | "location" | undefined =>
    isActive(to) ? (isLanding ? "location" : "page") : undefined;

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
      <aside
        className="sidebar"
        aria-label={isLanding ? "Landing page sections" : "Main navigation"}
      >
        <BrandLink />
        <span className="side-label">{isLanding ? "ON THIS PAGE" : "CAMPUS LIFE"}</span>
        <nav className="side-nav">
          {items.map((item, index) => {
            const active = isActive(item.to);
            return (
              <LandingLink
                key={item.label}
                to={item.to}
                className={active ? "active" : undefined}
                aria-current={currentAttr(item.to)}
              >
                <span className="nav-index">0{index + 1}</span>
                {item.label}
              </LandingLink>
            );
          })}
        </nav>
        <div className="side-bottom">
          {session ? (
            <>
              <LandingLink to="/dashboard">
                Dashboard <ArrowUpRight size={14} />
              </LandingLink>
              <LandingLink to="/profile">
                Profile <ArrowUpRight size={14} />
              </LandingLink>
            </>
          ) : (
            <>
              <LandingLink className="side-login" to="/auth">
                Log in
              </LandingLink>
              <LandingLink className="side-signup" to="/auth">
                Sign up
              </LandingLink>
            </>
          )}
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
            {items.map((item) => {
              const active = isActive(item.to);
              return (
                <LandingLink
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className={active ? "active" : undefined}
                  aria-current={currentAttr(item.to)}
                >
                  {item.label}
                  <ArrowUpRight size={14} />
                </LandingLink>
              );
            })}
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
