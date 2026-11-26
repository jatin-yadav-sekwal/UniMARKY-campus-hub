import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { hashTarget } from "@/components/site/navigation";

interface LandingLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  "aria-current"?: "page" | "location" | undefined;
  "aria-label"?: string;
  title?: string;
}

/**
 * Router link for the landing page. It keeps the design's plain markup (no
 * injected utility classes) and scrolls `/#section` targets without a reload.
 */
export function LandingLink({
  to,
  children,
  className,
  onClick,
  ...rest
}: LandingLinkProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const target = hashTarget(to);
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
    <Link to={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
