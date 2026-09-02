import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import {
    Search, CornerDownLeft, Sparkles, ShieldCheck
} from "lucide-react";

type CommandMode = "marketplace" | "study" | "housing" | "food";

interface CommandItem {
    id: string;
    icon: string;
    title: string;
    meta: string;
    badge: string;
    badgeTone: "orange" | "mint" | "slate";
    action: string;
}

const sequence: Array<{ mode: CommandMode; selectedIndex: number; cursorTarget: "chip" | "row" }> = [
    { mode: "marketplace", selectedIndex: 0, cursorTarget: "row" },
    { mode: "study", selectedIndex: 0, cursorTarget: "row" },
    { mode: "housing", selectedIndex: 0, cursorTarget: "row" },
    { mode: "food", selectedIndex: 0, cursorTarget: "row" },
];

const commandsData: Record<CommandMode, { label: string; placeholder: string; items: CommandItem[] }> = {
    marketplace: {
        label: "Trade Gear",
        placeholder: "Search laptops, calculators, textbooks near your gate...",
        items: [
            {
                id: "item-1",
                icon: "💻",
                title: 'iPad Pro 11" M2 (128GB Wi-Fi)',
                meta: "Near Gate 2 · Verified Senior",
                badge: "₹42,000",
                badgeTone: "orange",
                action: "Instant Chat",
            },
            {
                id: "item-2",
                icon: "📐",
                title: "Calculus: Early Transcendentals (9th Ed)",
                meta: "Library Steps · Condition: Like New",
                badge: "₹650",
                badgeTone: "orange",
                action: "Instant Chat",
            },
            {
                id: "item-3",
                icon: "🎧",
                title: "Sony WH-1000XM4 Noise Cancelling",
                meta: "Hostel Block C · Zero Fees",
                badge: "₹14,500",
                badgeTone: "orange",
                action: "Instant Chat",
            },
        ],
    },
    study: {
        label: "Course Notes",
        placeholder: "Search course codes, professor summaries, PYQs...",
        items: [
            {
                id: "item-4",
                icon: "📄",
                title: "CS301 Algorithm Analysis & Design Notes",
                meta: "Prof. Mehta · Handwritten Proofs & PYQs",
                badge: "PDF Guide",
                badgeTone: "mint",
                action: "Open Notes",
            },
            {
                id: "item-5",
                icon: "📑",
                title: "EE204 Signals & Systems Solved Midsems",
                meta: "Department Filtered · Complete Question Bank",
                badge: "Exam Pack",
                badgeTone: "mint",
                action: "Open Notes",
            },
            {
                id: "item-6",
                icon: "📊",
                title: "ME102 Engineering Graphics Cheatsheet",
                meta: "TA Approved · AutoCAD Formula Sheet",
                badge: "Cheatsheet",
                badgeTone: "slate",
                action: "Open Notes",
            },
        ],
    },
    housing: {
        label: "Student Housing",
        placeholder: "Search student flats, PGs, rooms near campus...",
        items: [
            {
                id: "item-7",
                icon: "🏠",
                title: "2BHK Furnished Student Flat (Flatmate Needed)",
                meta: "0.8 km from North Gate · Zero Brokerage",
                badge: "₹6,500 / mo",
                badgeTone: "orange",
                action: "View Stay",
            },
            {
                id: "item-8",
                icon: "🛏️",
                title: "Single AC Room in Scholar Stay PG",
                meta: "5 min walk from Campus · Meals Included",
                badge: "₹8,200 / mo",
                badgeTone: "orange",
                action: "View Stay",
            },
            {
                id: "item-9",
                icon: "🔑",
                title: "Double Sharing Room near Metro Gate 1",
                meta: "Shuttle Available · Wi-Fi & Power Backup",
                badge: "₹4,800 / mo",
                badgeTone: "slate",
                action: "View Stay",
            },
        ],
    },
    food: {
        label: "Dining Deals",
        placeholder: "Search campus eateries, late-night spots, meal deals...",
        items: [
            {
                id: "item-10",
                icon: "☕",
                title: "Central Campus Café & Bakery",
                meta: "12 min walk · Open Now · ₹120 Meal Combo",
                badge: "20% OFF",
                badgeTone: "orange",
                action: "Check Menu",
            },
            {
                id: "item-11",
                icon: "🍜",
                title: "Night Canteen & Chai Point",
                meta: "Hostel 4 Courtyard · Open till 2:00 AM",
                badge: "Open Late",
                badgeTone: "mint",
                action: "Check Menu",
            },
            {
                id: "item-12",
                icon: "🥗",
                title: "Green Bowl Salad & Juice Bar",
                meta: "Near Sports Complex · Healthy Meal Plans",
                badge: "10% Student OFF",
                badgeTone: "slate",
                action: "Check Menu",
            },
        ],
    },
};

export function WhyUnimarkySection() {
    const [stepIndex, setStepIndex] = useState(0);
    const [isClicking, setIsClicking] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, margin: "-80px" });
    const prefersReducedMotion = useReducedMotion();

    const currentStep = sequence[stepIndex];
    const currentConfig = commandsData[currentStep.mode];

    // Simulated click ripple triggered on each step transition
    useEffect(() => {
        setIsClicking(true);
        const timer = setTimeout(() => {
            setIsClicking(false);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [stepIndex]);

    // Automated demonstration loop: triggers every 3.8 seconds
    useEffect(() => {
        if (prefersReducedMotion || !isInView) return;

        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % sequence.length);
        }, 3800);

        return () => {
            clearInterval(interval);
        };
    }, [prefersReducedMotion, isInView]);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-[#FFFCF8] text-[#24324A] border-t border-[#F1E7DF]"
        >
            {/* Ambient Background Grid Texture & Diffuse Warm Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#24324A04_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-b from-[#FFE1D2]/25 via-[#FFF7EF]/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

            <div className="container max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                
                {/* 1. EDITORIAL SECTION HEADER */}
                <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14 space-y-3">
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.45 }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 mb-1"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                            Made for Campus Speed
                        </span>
                        <Sparkles className="w-3 h-3 text-[#FF713F] opacity-75" />
                    </m.div>

                    <m.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.04] text-[#24324A]"
                    >
                        Everything on campus,{" "}
                        <span className="bg-gradient-to-r from-[#FF5A36] to-[#FF713F] bg-clip-text text-transparent">
                            at the speed of a keystroke.
                        </span>
                    </m.h2>

                    <m.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.16 }}
                        className="text-sm sm:text-base text-[#71839B] max-w-md mx-auto font-normal leading-relaxed"
                    >
                        Search gear, notes, dining, and housing in real-time with instant peer actions.
                    </m.p>
                </div>

                {/* 2. AUTOMATED PRODUCT STORYTELLING DEMO (Hands-Free Predefined Animation) */}
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-3xl mx-auto rounded-2xl sm:rounded-3xl bg-white/95 border border-[#F1E7DF] shadow-[0_16px_48px_rgba(36,50,74,0.06)] overflow-hidden pointer-events-none select-none"
                >
                    {/* Command Search Bar Input Header */}
                    <div className="p-4 sm:p-5 border-b border-[#F1E7DF] bg-[#FFFDFB] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5A36] shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-[#71839B] truncate">
                                {currentConfig.placeholder}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#FFF5EC] border border-[#F1E7DF] text-[10px] font-mono font-bold text-[#FF5A36] shrink-0">
                            <span>⌘</span>
                            <span>K</span>
                        </div>
                    </div>

                    {/* Command Mode Chips with Automated Simulated Selection */}
                    <div className="px-4 sm:px-5 py-3 border-b border-[#F1E7DF]/70 bg-white flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
                        {(Object.keys(commandsData) as CommandMode[]).map((mode) => {
                            const isActive = mode === currentStep.mode;
                            return (
                                <div
                                    key={mode}
                                    className={`relative px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-300 ${
                                        isActive
                                            ? "bg-[#FFF5EC] text-[#FF5A36] border border-[#FF5A36]/40 shadow-2xs scale-[1.02]"
                                            : "bg-[#FFF7EF]/60 text-[#71839B] border border-transparent"
                                    }`}
                                >
                                    <span>{commandsData[mode].label}</span>
                                    {/* Simulated Click Ripple Animation */}
                                    {isActive && isClicking && (
                                        <span className="absolute inset-0 rounded-full bg-[#FF5A36]/20 animate-ping" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Instant Action Feed Rows with Automated Selection */}
                    <div className="p-3 sm:p-4 space-y-1.5 min-h-[220px]">
                        <AnimatePresence mode="wait">
                            <m.div
                                key={currentStep.mode}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.22 }}
                                className="space-y-1.5"
                            >
                                {currentConfig.items.map((item, index) => {
                                    const isHighlighted = index === 0;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`relative p-3 sm:p-3.5 rounded-xl border transition-[background-color,border-color,box-shadow,opacity] duration-300 flex items-center justify-between gap-3 ${
                                                isHighlighted
                                                    ? "bg-[#FFF5EC]/90 border-[#FF5A36]/40 shadow-xs"
                                                    : "bg-white border-[#F1E7DF]/80 opacity-75"
                                            }`}
                                        >
                                            {/* Left: Icon + Title + Meta */}
                                            <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                                                <span className="text-base sm:text-lg shrink-0">
                                                    {item.icon}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-xs sm:text-sm font-bold text-[#24324A] truncate">
                                                            {item.title}
                                                        </h4>
                                                        <span
                                                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md shrink-0 border ${
                                                                item.badgeTone === "orange"
                                                                    ? "bg-[#FFF5EC] text-[#FF5A36] border-[#F1E7DF]"
                                                                    : item.badgeTone === "mint"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                                            }`}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-[#71839B] truncate mt-0.5">
                                                        {item.meta}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Automated Action Key Prompt */}
                                            <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                                                <span className={`hidden sm:inline ${isHighlighted ? "text-[#FF5A36]" : "text-[#71839B]"}`}>
                                                    {item.action}
                                                </span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-mono transition-colors ${
                                                    isHighlighted
                                                        ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                                                        : "bg-white text-[#71839B] border-[#F1E7DF]"
                                                }`}>
                                                    <CornerDownLeft className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </m.div>
                        </AnimatePresence>
                    </div>

                    {/* Command Palette Keyboard Helper Footer */}
                    <div className="px-4 sm:px-5 py-3 border-t border-[#F1E7DF] bg-[#FFFDFB] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#71839B] font-medium">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#F1E7DF] font-mono text-[9px] shadow-2xs">↑↓</kbd>
                                <span>Navigate</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#F1E7DF] font-mono text-[9px] shadow-2xs">↵</kbd>
                                <span>Action</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#F1E7DF] font-mono text-[9px] shadow-2xs">esc</kbd>
                                <span>Clear</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#20BFA3]">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[#71839B]">0% Student Fees · Verified ID Only</span>
                        </div>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
