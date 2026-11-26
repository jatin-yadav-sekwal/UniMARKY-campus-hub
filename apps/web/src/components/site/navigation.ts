export interface SiteNavItem {
  label: string;
  to: string;
}

/**
 * Primary navigation. Every entry is a full page of the site — the public
 * shell never points back at an anchor inside the landing page.
 */
export const siteNav: SiteNavItem[] = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Communities", to: "/communities" },
  { label: "Study", to: "/study" },
  { label: "Accommodation", to: "/housing" },
  { label: "Food", to: "/food" },
  { label: "Lost & Found", to: "/lost-found" },
];

/**
 * Section index for the landing page. The public shell swaps to this list on
 * `/` so the sidebar mirrors the page instead of repeating the page nav.
 */
export const landingSections: SiteNavItem[] = [
  { label: "Connected campus", to: "/#ecosystem" },
  { label: "Marketplace", to: "/#marketplace" },
  { label: "Community", to: "/#community" },
  { label: "Study", to: "/#study" },
  { label: "Accommodation", to: "/#accommodation" },
  { label: "Food", to: "/#food" },
  { label: "Integration", to: "/#services" },
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
