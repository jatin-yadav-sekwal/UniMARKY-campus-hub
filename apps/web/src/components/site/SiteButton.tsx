import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SiteLink } from "./SiteLink";

type SiteButtonVariant = "primary" | "secondary" | "inverse" | "ghost-inverse";
type SiteButtonSize = "md" | "lg";

const base =
  "um-focus inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants: Record<SiteButtonVariant, string> = {
  primary:
    "bg-um-ink text-white shadow-[0_1px_2px_rgba(23,23,23,0.16)] hover:bg-black hover:shadow-[0_6px_20px_rgba(23,23,23,0.16)] active:translate-y-px",
  secondary:
    "border border-um-line bg-white/80 text-um-ink hover:border-um-ink/25 hover:bg-white active:translate-y-px",
  inverse:
    "bg-white text-um-ink hover:bg-white/90 active:translate-y-px",
  "ghost-inverse":
    "border border-white/25 text-white/85 hover:border-white/50 hover:text-white active:translate-y-px",
};

const sizes: Record<SiteButtonSize, string> = {
  md: "h-10 px-4 text-[13.5px]",
  lg: "h-11 px-5 text-sm sm:h-12 sm:px-6",
};

export function siteButtonClass(
  variant: SiteButtonVariant = "primary",
  size: SiteButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

interface SiteButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: SiteButtonVariant;
  size?: SiteButtonSize;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

export function SiteButton({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ariaLabel,
}: SiteButtonProps) {
  const classes = siteButtonClass(variant, size, className);

  if (to) {
    return (
      <SiteLink to={to} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {children}
      </SiteLink>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
