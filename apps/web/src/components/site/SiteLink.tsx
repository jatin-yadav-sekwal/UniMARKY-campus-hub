import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { hashTarget } from "./navigation";

interface SiteLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  onClick?: () => void;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
  title?: string;
}

/**
 * Router link that also understands `/#section` targets.
 * Same-page targets scroll without a reload; cross-page targets navigate and
 * let the landing page's hash effect finish the scroll.
 */
export function SiteLink({
  to,
  children,
  className,
  onNavigate,
  onClick,
  ...rest
}: SiteLinkProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = hashTarget(to);
    onClick?.();
    onNavigate?.();

    if (target && pathname === "/") {
      const element = document.getElementById(target);
      if (element) {
        event.preventDefault();
        element.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        navigate(to, { replace: true });
      }
    }
  };

  return (
    <Link to={to} onClick={handleClick} className={cn("um-focus rounded-lg", className)} {...rest}>
      {children}
    </Link>
  );
}
