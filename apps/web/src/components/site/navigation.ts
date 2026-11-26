export interface SiteNavItem {
  label: string;
  to: string;
}

/** Primary navigation. Hash targets live on the landing page. */
export const siteNav: SiteNavItem[] = [
  { label: "Ecosystem", to: "/#ecosystem" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Community", to: "/communities" },
  { label: "Study", to: "/study" },
  { label: "Accommodation", to: "/housing" },
  { label: "Food", to: "/food" },
  { label: "Integration", to: "/#integration" },
  { label: "FAQs", to: "/#faqs" },
];

export function hashTarget(to: string): string | null {
  return to.startsWith("/#") ? to.slice(2) : null;
}

export function isNavItemActive(to: string, pathname: string, hash: string): boolean {
  const target = hashTarget(to);

  if (target) {
    if (pathname !== "/") return false;
    if (target === "ecosystem") return hash === "" || hash === "#ecosystem";
    return hash === `#${target}`;
  }

  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}
