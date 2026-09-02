import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { m, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { generateDisplacementMap, type LensGeometry } from "./displacement-engine";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    depth?: number;
    curvature?: number;
    chroma?: number;
    scale?: number;
    radius?: number;
    glow?: string;
    tint?: "warm" | "orange" | "clear" | "white";
    interactiveGlint?: boolean;
    variant?: "capsule" | "card" | "pill" | "button";
    frosted?: boolean;
    children?: React.ReactNode;
}

export function GlassSurface({
    depth = 0.5,
    curvature = 0.65,
    chroma = 0.35,
    scale = 16,
    radius,
    glow,
    tint = "warm",
    interactiveGlint = true,
    variant = "capsule",
    frosted = true,
    className,
    children,
    ...props
}: GlassSurfaceProps) {
    const rawId = useId();
    const filterId = useMemo(() => `liquid-lens-${rawId.replace(/[:]/g, "")}`, [rawId]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mapUrl, setMapUrl] = useState<string>("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50, active: false });

    // Determine default radius based on variant
    const effectiveRadius = radius ?? (variant === "capsule" || variant === "pill" || variant === "button" ? 9999 : 24);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateMap = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const url = generateDisplacementMap({
                    width: rect.width,
                    height: rect.height,
                    radius: effectiveRadius,
                    depth,
                    curvature,
                    splay: 1.0,
                });
                setMapUrl(url);
            }
        };

        updateMap();

        // Observe resize events (only regenerate when geometry actually changes)
        const resizeObserver = new ResizeObserver(() => {
            updateMap();
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [effectiveRadius, depth, curvature]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactiveGlint || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y, active: true });
    };

    const handleMouseLeave = () => {
        setMousePos((prev) => ({ ...prev, active: false }));
    };

    // Tint color maps
    const tintClasses = {
        warm: "bg-[#FFFCF8]/80 text-[#24324A]",
        white: "bg-white/85 text-[#24324A]",
        orange: "bg-gradient-to-r from-[#FF5A36]/90 to-[#FF713F]/90 text-white shadow-[0_8px_24px_rgba(255,90,54,0.3)]",
        clear: "bg-white/60 text-[#24324A]",
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative isolate overflow-hidden transition-[background-color,border-color,box-shadow] duration-300",
                variant === "capsule" || variant === "pill" || variant === "button" ? "rounded-full" : "rounded-3xl",
                frosted && [
                    tintClasses[tint],
                    "backdrop-blur-xl backdrop-saturate-[180%]",
                    "border border-[#F1E7DF]/90",
                    "shadow-[0_8px_32px_rgba(36,50,74,0.06),inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(36,50,74,0.03)]",
                ],
                glow && `shadow-[0_8px_32px_${glow}]`,
                className
            )}
            {...props}
        >
            {/* Scoped SVG Displacement Map Filter Definition with Safari Cache-Id */}
            {mapUrl && (
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute h-0 w-0 overflow-hidden"
                    style={{ position: "absolute", width: 0, height: 0 }}
                >
                    <defs>
                        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
                            <feImage href={mapUrl} result="DISP_MAP" preserveAspectRatio="none" />
                            {/* Chromatic separation pass */}
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="DISP_MAP"
                                scale={scale + Math.round(chroma * 6)}
                                xChannelSelector="R"
                                yChannelSelector="G"
                                result="RED_PASS"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="DISP_MAP"
                                scale={scale}
                                xChannelSelector="R"
                                yChannelSelector="G"
                                result="BASE_PASS"
                            />
                            <feBlend in="RED_PASS" in2="BASE_PASS" mode="screen" result="CHROMATIC" />
                            <feGaussianBlur in="CHROMATIC" stdDeviation="0.2" result="FINAL_REFRACT" />
                            <feMerge>
                                <feMergeNode in="FINAL_REFRACT" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            )}

            {/* Specular Glint responding to pointer */}
            {interactiveGlint && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                    style={{
                        opacity: mousePos.active ? 1 : 0,
                        background: `radial-gradient(circle 140px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.7), transparent 70%)`,
                    }}
                />
            )}

            {/* Top Specular Rim */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 z-10 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
            />

            {/* Live DOM Content */}
            <div className="relative z-20 h-full w-full">{children}</div>
        </div>
    );
}

// Alias for LiquidGlass
export const LiquidGlass = GlassSurface;

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "pill" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function LiquidGlassButton({
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: LiquidGlassButtonProps) {
    const sizeClasses = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3.5 text-sm",
        lg: "px-8 py-5 text-base",
    };

    const isPrimary = variant === "primary";

    return (
        <m.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn("group relative inline-flex items-center justify-center font-bold focus:outline-hidden", className)}
            {...(props as any)}
        >
            <GlassSurface
                variant="button"
                depth={isPrimary ? 0.6 : 0.4}
                scale={isPrimary ? 18 : 12}
                tint={isPrimary ? "orange" : "warm"}
                className={cn(
                    "w-full h-full flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow] duration-300",
                    sizeClasses[size],
                    isPrimary
                        ? "shadow-[0_8px_24px_rgba(255,90,54,0.3)] hover:shadow-[0_12px_32px_rgba(255,90,54,0.45)] border-white/30 text-white"
                        : "bg-[#FFF5EC]/80 hover:bg-white text-[#24324A] hover:border-[#FF5A36]/30 shadow-[0_4px_16px_rgba(36,50,74,0.06)]"
                )}
            >
                {children}
            </GlassSurface>
        </m.button>
    );
}

interface LiquidGlassPillProps extends HTMLMotionProps<"div"> {
    className?: string;
    layoutId?: string;
    children?: React.ReactNode;
}

export function LiquidGlassPill({
    className,
    layoutId = "liquid-lens-pill",
    children,
    ...props
}: LiquidGlassPillProps) {
    return (
        <m.div
            layoutId={layoutId}
            transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.75,
            }}
            className={cn(
                "absolute inset-0 rounded-full",
                "bg-gradient-to-b from-white via-white/95 to-[#FFE1D2]/50",
                "backdrop-blur-xl backdrop-saturate-200",
                "shadow-[0_4px_16px_rgba(255,90,54,0.2),0_1px_3px_rgba(36,50,74,0.06),inset_0_1.5px_1.5px_0_rgba(255,255,255,1),inset_0_-1px_2px_0_rgba(255,90,54,0.15)]",
                "border border-white/90",
                className
            )}
            {...props}
        >
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[#FF5A36]/20 opacity-70" />
            <div className="pointer-events-none absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-100" />
            {children}
        </m.div>
    );
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    depth?: number;
    curvature?: number;
    children: React.ReactNode;
}

export function GlassCard({
    depth = 0.45,
    curvature = 0.6,
    className,
    children,
    ...props
}: GlassCardProps) {
    return (
        <GlassSurface
            variant="card"
            depth={depth}
            curvature={curvature}
            radius={24}
            className={cn(
                "p-4 rounded-3xl bg-white/80 border border-[#F1E7DF] shadow-[0_12px_32px_rgba(36,50,74,0.08)]",
                className
            )}
            {...props}
        >
            {children}
        </GlassSurface>
    );
}
