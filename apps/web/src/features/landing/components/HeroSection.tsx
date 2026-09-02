import { m } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { HeroAtmosphere } from "./HeroAtmosphere";

const scrollToEcosystem = () => {
    const ecosystem = document.getElementById("ecosystem");
    if (ecosystem) {
        ecosystem.scrollIntoView({ behavior: "smooth" });
    }
};

export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative pt-28 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden min-h-[100dvh] sm:min-h-[680px] lg:min-h-[780px] flex flex-col justify-center items-center bg-[#FFFCF8] text-[#24324A]"
        >
            {/* Organic Flowing Atmosphere & Right-to-Left Continuous Gradient Waves */}
            <HeroAtmosphere />

            {/* Main Restrained Hero Typography & CTA Composition */}
            <div className="container max-w-5xl px-5 sm:px-6 lg:px-8 mx-auto relative z-10 flex flex-col items-center text-center my-auto py-2">
                
                {/* 1. REFINED EDITORIAL EYEBROW (150ms entrance) */}
                <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 mb-5 xs:mb-7 sm:mb-6"
                >
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36] shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#71839B]">
                        The Digital Campus Network
                    </span>
                    <Sparkles className="w-3 h-3 text-[#FF713F] opacity-75 shrink-0" />
                </m.div>

                {/* 2. RESTRAINED EDITORIAL HEADLINE (Mobile: 34-38px, Tablet: 48-56px, Desktop: 68px) */}
                <div className="max-w-3xl">
                    <h1 className="text-[34px] xs:text-[38px] sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.04] sm:leading-[0.98] text-[#24324A]">
                        <m.span
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="block"
                        >
                            YOUR UNIVERSITY.
                        </m.span>
                        <m.span
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="block mt-1 sm:mt-1.5 bg-gradient-to-r from-[#FF5A36] via-[#FF3366] to-[#FF5B8A] bg-clip-text text-transparent"
                        >
                            IN ONE PLACE.
                        </m.span>
                    </h1>
                </div>

                {/* 3. CONCISE SUPPORTING STATEMENT (420ms entrance) */}
                <m.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.42, ease: "easeOut" }}
                    className="mt-5 xs:mt-7 sm:mt-6 text-xs xs:text-sm sm:text-base md:text-lg text-[#71839B] max-w-[290px] xs:max-w-xs sm:max-w-md lg:max-w-lg mx-auto font-normal leading-relaxed"
                >
                    Everything your campus needs, in one place.
                </m.p>

                {/* 4. COMPACT PREMIUM CTA GROUP (500ms entrance) */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.50, ease: "easeOut" }}
                    className="mt-8 xs:mt-11 sm:mt-8 lg:mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4"
                >
                    {/* Primary CTA (compact, refined pill button) */}
                    <m.button
                        type="button"
                        onClick={scrollToEcosystem}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#FF713F] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(255,90,54,0.25)] hover:shadow-[0_8px_28px_rgba(255,90,54,0.38)] active:shadow-none transition-shadow duration-200 cursor-pointer select-none shrink-0"
                    >
                        <span>Explore Portal</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                    </m.button>

                    {/* Secondary Action (quiet refined compact inline button) */}
                    <m.button
                        type="button"
                        onClick={scrollToEcosystem}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-3.5 sm:px-5 rounded-full text-[#71839B] hover:text-[#24324A] text-xs sm:text-sm font-medium hover:bg-[#FFE1D2]/30 transition-[color,background-color] duration-200 cursor-pointer select-none shrink-0"
                    >
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFF7EF] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36] group-hover:translate-x-0.5 transition-transform duration-200">
                            <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current ml-0.5" />
                        </span>
                        <span>See how it works</span>
                    </m.button>
                </m.div>
            </div>
        </section>
    );
}
