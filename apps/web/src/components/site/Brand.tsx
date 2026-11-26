import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/components/layout/file.svg";

interface BrandProps {
  className?: string;
  imageClassName?: string;
  onNavigate?: () => void;
}

export function Brand({ className, imageClassName, onNavigate }: BrandProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label="UniMARKY home"
      className={cn("um-focus inline-flex items-center rounded-md", className)}
    >
      <img
        src={logo}
        alt="UniMARKY"
        className={cn("h-7 w-auto select-none", imageClassName)}
        draggable={false}
      />
    </Link>
  );
}
