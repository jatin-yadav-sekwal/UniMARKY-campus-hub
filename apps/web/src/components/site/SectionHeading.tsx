import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className={cn("um-eyebrow", align === "center" && "justify-center")}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-4 font-display text-[30px] font-semibold leading-[1.06] tracking-[-0.035em] text-um-ink sm:text-[34px] lg:text-[40px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-um-ink-2 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
