import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    title: string;
    tagline: string;
    icon: LucideIcon;
    href: string;
    colorClass: string; // e.g., "text-brand-orange"
    bgClass?: string;   // Optional bg tint
    borderColorClass?: string; // e.g. "group-hover:border-brand-orange"
}

export function FeatureCard({
    title,
    tagline,
    icon: Icon,
    href,
    colorClass,
    borderColorClass
}: FeatureCardProps) {
    return (
        <motion.a
            href={href} // Using simple anchor for now as requested plan
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-brand-navy p-8 transition-all duration-300",
                "bg-white hover:shadow-2xl hover:border-transparent", // Base styles
                "hover:ring-2 hover:ring-opacity-50", // Ring for focus
                borderColorClass // Dynamic border color on hover
            )}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Icon Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-white",
                    "shadow-sm ring-1 ring-black/5"
                )}>
                    <Icon
                        className={cn(
                            "h-7 w-7 transition-all duration-300 group-hover:scale-110",
                            colorClass
                        )}
                        strokeWidth={2}
                    />
                </div>

                {/* External Link Arrow */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/5 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4 text-brand-navy" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-brand-navy">
                    {title}
                </h3>
                <p className="text-brand-blue/80 font-medium">
                    {tagline}
                </p>
            </div>

            {/* Hover Gradient Overlay */}
            <div className={cn(
                "absolute inset-0 z-[-1] opacity-0 transition-opacity duration-300 group-hover:opacity-5",
                colorClass.replace("text-", "bg-") // Hacky but effective for simple color mapping
            )} />

        </motion.a>
    );
}
