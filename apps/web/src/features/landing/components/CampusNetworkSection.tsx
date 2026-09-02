import { useState, useRef } from "react";
import { m, useInView } from "motion/react";
import { Link } from "react-router-dom";
import {
    ShoppingBag, BookOpen, House, Utensils, Search,
    ArrowRight, Sparkles
} from "lucide-react";

interface NetworkNode {
    id: string;
    title: string;
    label: string;
    icon: typeof ShoppingBag;
    href: string;
    position: string;
}

const networkNodes: NetworkNode[] = [
    {
        id: "marketplace",
        title: "Marketplace",
        label: "Gear & Trades",
        icon: ShoppingBag,
        href: "/marketplace",
        position: "top-3 left-2 sm:top-5 sm:left-6 lg:left-10",
    },
    {
        id: "study",
        title: "Study",
        label: "Notes & PYQs",
        icon: BookOpen,
        href: "/study",
        position: "top-3 right-2 sm:top-5 sm:right-6 lg:right-10",
    },
    {
        id: "housing",
        title: "Housing",
        label: "PGs & Flats",
        icon: House,
        href: "/housing",
        position: "bottom-3 left-2 sm:bottom-5 sm:left-6 lg:left-10",
    },
    {
        id: "food",
        title: "Dining",
        label: "Food & Deals",
        icon: Utensils,
        href: "/food",
        position: "bottom-3 right-2 sm:bottom-5 sm:right-6 lg:right-10",
    },
    {
        id: "lost-found",
        title: "Lost & Found",
        label: "Campus Radar",
        icon: Search,
        href: "/lost-found",
        position: "top-1/2 -translate-y-1/2 right-1 sm:right-3 lg:right-4",
    },
];

export function CampusNetworkSection() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            id="network"
            ref={sectionRef}
            className="relative py-16 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-br from-[#FF5A36] via-[#FF6745] to-[#FF4F6D] text-white"
        >
            {/* Luminous Atmospheric Energy Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF12_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] sm:w-[700px] h-[350px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-16 right-10 w-[350px] h-[350px] bg-[#FF4F6D]/35 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                
                {/* 1. EDITORIAL BRAND HEADER */}
                <div className="max-w-xl mx-auto text-center mb-8 sm:mb-12 space-y-2.5">
                    <m.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md mb-0.5"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                            The Campus Network
                        </span>
                        <Sparkles className="w-3 h-3 text-white/80" />
                    </m.div>

                    <m.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight leading-[1.06] text-white"
                    >
                        ONE CAMPUS.{" "}
                        <span className="text-white/90">
                            EVERYONE CONNECTED.
                        </span>
                    </m.h2>

                    <m.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.45, delay: 0.16 }}
                        className="text-xs sm:text-sm text-white/80 max-w-md mx-auto font-normal leading-relaxed"
                    >
                        Trade gear, share notes, find housing, and discover campus life — all in one network.
                    </m.p>
                </div>

                {/* 2. COMPACT CONNECTED NETWORK CENTERPIECE */}
                <m.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-3xl h-[280px] sm:h-[320px] lg:h-[360px] mx-auto rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden flex items-center justify-center"
                >
                    {/* SVG Flowing Connection Lines */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none stroke-white/25"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Concentric Orbital Rings */}
                        <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
                        <circle cx="50%" cy="50%" r="130" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                        {/* Connection Rays */}
                        <line x1="50%" y1="50%" x2="22%" y2="18%" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                        <line x1="50%" y1="50%" x2="78%" y2="18%" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                        <line x1="50%" y1="50%" x2="22%" y2="82%" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                        <line x1="50%" y1="50%" x2="78%" y2="82%" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                        <line x1="50%" y1="50%" x2="88%" y2="50%" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                    </svg>

                    {/* Central UniMARKY Core Node */}
                    <div className="relative z-20 flex flex-col items-center justify-center">
                        <div className="relative p-3 sm:p-4 rounded-2xl bg-white text-[#FF5A36] shadow-[0_8px_24px_rgba(0,0,0,0.18),0_0_35px_rgba(255,255,255,0.35)] border border-white flex flex-col items-center justify-center gap-0.5 min-w-[100px] sm:min-w-[120px]">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36] animate-ping absolute -top-0.5 -right-0.5" />
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                                <span className="text-xs sm:text-sm font-black tracking-tight text-[#24324A]">
                                    UniMARKY
                                </span>
                            </div>
                            <span className="text-[9px] font-semibold text-[#71839B] uppercase tracking-wider">
                                Campus Core
                            </span>
                        </div>
                    </div>

                    {/* Orbiting Destination Network Nodes */}
                    {networkNodes.map((node) => {
                        const Icon = node.icon;
                        const isHovered = hoveredNode === node.id;
                        return (
                            <Link
                                key={node.id}
                                to={node.href}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className={`absolute z-20 ${node.position} group transition-transform duration-150 select-none`}
                            >
                                <div
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border transition-[background-color,border-color,box-shadow,transform] duration-150 flex items-center gap-2 ${
                                        isHovered
                                            ? "bg-white text-[#24324A] border-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] scale-105"
                                            : "bg-white/20 hover:bg-white/30 text-white border-white/25 backdrop-blur-md shadow-2xs"
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-colors ${
                                            isHovered
                                                ? "bg-[#FFF5EC] text-[#FF5A36]"
                                                : "bg-white/20 text-white"
                                        }`}
                                    >
                                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] sm:text-xs font-bold leading-tight">
                                                {node.title}
                                            </span>
                                            <ArrowRight className={`w-2.5 h-2.5 transition-transform ${isHovered ? "translate-x-0.5 text-[#FF5A36]" : "opacity-50"}`} />
                                        </div>
                                        <span className={`hidden xs:block text-[9px] leading-tight ${isHovered ? "text-[#71839B]" : "text-white/70"}`}>
                                            {node.label}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </m.div>
            </div>
        </section>
    );
}
