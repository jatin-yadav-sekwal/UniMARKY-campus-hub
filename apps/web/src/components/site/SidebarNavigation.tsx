import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { isNavItemActive, siteNav } from "./navigation";
import { SiteLink } from "./SiteLink";

interface SidebarNavigationProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNavigation({ onNavigate, className }: SidebarNavigationProps) {
  const { pathname, hash } = useLocation();

  return (
    <nav aria-label="Primary navigation" className={cn("mt-10", className)}>
      <ul className="space-y-1">
        {siteNav.map((item) => {
          const active = isNavItemActive(item.to, pathname, hash);

          return (
            <li key={item.label}>
              <SiteLink
                to={item.to}
                onNavigate={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-9 items-center gap-2 rounded-lg px-2 text-[14px] leading-none transition-colors duration-150",
                  active
                    ? "bg-black/[0.055] font-semibold text-um-ink"
                    : "font-medium text-um-ink-2 hover:bg-black/[0.035] hover:text-um-ink",
                )}
              >
                <span className="truncate">{item.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "ml-auto h-1 w-1 shrink-0 rounded-full transition-colors duration-150",
                    active ? "bg-um-accent" : "bg-transparent",
                  )}
                />
              </SiteLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
