/**
 * UniMARKY Global Design System Foundations
 * "Raycast-level design discipline, translated into UniMARKY"
 * Light Mode Only: Warm Light Canvas (#FFFCF8) + Orange Energy (#FF5A36)
 */

export const CAMPUS_COLORS = {
    bg: "#FFFCF8",
    secondary: "#FFF7EF",
    peach: "#FFE1D2",
    orange: "#FF5A36",
    brightOrange: "#FF713F",
    deep: "#24324A",
    muted: "#71839B",
    border: "#F1E7DF",
    mint: "#20BFA3",
} as const;

export const SPACING_SCALE = {
    xs: "4px",
    sm: "8px",
    md: "12px",
    base: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
} as const;

export const RADIUS_SCALE = {
    ui: "8px",        // Micro UI, inputs, tags
    card: "16px",     // Module cards, tiles
    surface: "24px",  // Containers, floating cards
    pill: "9999px",   // Buttons, active tabs, badges
} as const;

export const SHADOW_SCALE = {
    xs: "0 1px 2px 0 rgba(36, 50, 74, 0.04)",
    sm: "0 2px 8px 0 rgba(36, 50, 74, 0.04), 0 1px 2px 0 rgba(36, 50, 74, 0.02)",
    md: "0 8px 24px -4px rgba(36, 50, 74, 0.06), 0 2px 6px -1px rgba(36, 50, 74, 0.03)",
    lg: "0 16px 36px -6px rgba(36, 50, 74, 0.08), 0 4px 12px -2px rgba(36, 50, 74, 0.04)",
    orange: "0 8px 24px -4px rgba(255, 90, 54, 0.25), 0 2px 6px -1px rgba(255, 90, 54, 0.15)",
    glass: "0 8px 32px 0 rgba(36, 50, 74, 0.06), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(36, 50, 74, 0.03)",
} as const;

export const MOTION_SYSTEM = {
    timing: {
        micro: 0.15,      // 150ms
        hover: 0.22,      // 220ms
        component: 0.35,  // 350ms
        entrance: 0.7,    // 700ms
        atmospheric: 1.2, // 1200ms
    },
    spring: {
        snappy: { type: "spring", stiffness: 450, damping: 30, mass: 0.7 },
        gentle: { type: "spring", stiffness: 300, damping: 28, mass: 0.9 },
        smooth: { type: "spring", stiffness: 200, damping: 25, mass: 1.0 },
    },
    transitions: {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 },
        },
        slideUp: {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
        staggerContainer: (staggerDelay = 0.08) => ({
            animate: {
                transition: {
                    staggerChildren: staggerDelay,
                },
            },
        }),
    },
} as const;
