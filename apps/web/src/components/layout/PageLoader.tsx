import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  /** `screen` fills the viewport, `inline` sits inside a page body. */
  variant?: "screen" | "inline";
  className?: string;
}

/**
 * Shared loading state for the editorial site: three accent bars and a mono
 * label. Replaces the old orange spinners so every wait looks the same.
 */
export function PageLoader({
  label = "Loading",
  variant = "screen",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn("um-loader", variant === "inline" && "um-loader-inline", className)}
      role="status"
      aria-live="polite"
    >
      <span className="um-loader-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="um-loader-label">{label}</span>
    </div>
  );
}
