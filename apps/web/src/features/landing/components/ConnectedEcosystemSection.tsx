import { useRef } from "react";
import { m, useInView } from "motion/react";
import { Link } from "react-router-dom";
import {
    ShoppingBag, BookOpen, House, Utensils, Search,
    ArrowUpRight
} from "lucide-react";

export function ConnectedEcosystemSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            id="ecosystem"
            ref={sectionRef}
            className="relative py-16 sm:py-28 lg:py-36 overflow-hidden bg-[#FFFCF8] text-[#24324A] border-t border-[#F1E7DF]/80"
        >
            {/* Ambient Warm Glow in Background */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-b from-[#FFE1D2]/35 via-[#FFF7EF]/20 to-transparent rounded-full blur-[90px] sm:blur-[140px] pointer-events-none" />

            <div className="container max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
                    
                    {/* =========================================================
                        LEFT COLUMN: Minimal Headline (Direct Reference Match)
                       ========================================================= */}
                    <div className="lg:col-span-5 text-left space-y-2.5 sm:space-y-3">
                        <m.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                            transition={{ duration: 0.4 }}
                            className="inline-flex items-center gap-1.5 mb-0.5"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                                The Campus Ecosystem
                            </span>
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.08] text-[#24324A]">
                                It’s not about saving time.
                                <span className="block mt-1 text-base xs:text-lg sm:text-2xl lg:text-[28px] font-normal text-[#71839B] leading-snug">
                                    It’s about feeling like you’re never wasting it.
                                </span>
                            </h2>
                        </m.div>
                    </div>

                    {/* =========================================================
                        RIGHT COLUMN: Shorter Asynchronous Keycap Matrix for Mobile & Desktop
                       ========================================================= */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2.5 max-w-[540px] mx-auto lg:ml-auto select-none">
                            
                            {/* ROW 0: Ambient Function Keys (Desktop only) */}
                            <div className="hidden sm:flex h-8 sm:h-9 rounded-xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                esc
                            </div>
                            <div className="hidden sm:flex h-8 sm:h-9 rounded-xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                F1
                            </div>
                            <div className="hidden sm:flex h-8 sm:h-9 rounded-xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                F2
                            </div>
                            <div className="hidden sm:flex h-8 sm:h-9 rounded-xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                F3
                            </div>
                            <div className="hidden sm:flex h-8 sm:h-9 rounded-xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                F4
                            </div>

                            {/* ROW 1: Ambient Number Keys (Desktop only) */}
                            <div className="hidden sm:flex h-11 rounded-xl border border-[#F1E7DF]/60 bg-white/40 flex-col items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                <span>±</span>
                                <span className="text-[9px]">§</span>
                            </div>
                            <div className="hidden sm:flex h-11 rounded-xl border border-[#F1E7DF]/60 bg-white/40 flex-col items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                <span>!</span>
                                <span className="text-[9px]">1</span>
                            </div>
                            <div className="hidden sm:flex h-11 rounded-xl border border-[#F1E7DF]/60 bg-white/40 flex-col items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                <span>@</span>
                                <span className="text-[9px]">2</span>
                            </div>
                            <div className="hidden sm:flex h-11 rounded-xl border border-[#F1E7DF]/60 bg-white/40 flex-col items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                <span>#</span>
                                <span className="text-[9px]">3</span>
                            </div>
                            <div className="hidden sm:flex h-11 rounded-xl border border-[#F1E7DF]/60 bg-white/40 flex-col items-center justify-center text-[10px] font-mono text-[#71839B]/50">
                                <span>$</span>
                                <span className="text-[9px]">4</span>
                            </div>

                            {/* ROW 2: [Tab Key (1 col)] + [TILE 1: Marketplace (3 cols on mobile, 2 cols on sm)] + [TILE 2: Study (2 cols on sm)] */}
                            <div className="flex h-[76px] sm:h-[88px] rounded-xl sm:rounded-2xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-xs font-mono text-[#71839B]/40 shrink-0">
                                ⇥
                            </div>

                            {/* TILE 1: MARKETPLACE */}
                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.1 }}
                                className="col-span-3 sm:col-span-2"
                            >
                                <Link
                                    to="/marketplace"
                                    className="group relative p-2.5 xs:p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#F1E7DF] hover:border-[#FF5A36]/50 shadow-[0_2px_8px_rgba(36,50,74,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_20px_rgba(36,50,74,0.07)] hover:-translate-y-0.5 active:translate-y-0 transition-[border-color,box-shadow,transform] duration-150 flex flex-col justify-between h-[76px] sm:h-[88px]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71839B] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                    <p className="text-left text-[11px] sm:text-xs font-bold text-[#24324A] group-hover:text-[#FF5A36] transition-colors leading-tight">
                                        <span className="font-black">Marketplace.</span>{" "}
                                        <span className="font-normal text-[#71839B]">Buy & sell.</span>
                                    </p>
                                </Link>
                            </m.div>

                            {/* TILE 2: STUDY (Spans 3 cols on mobile, 2 cols on sm) */}
                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.16 }}
                                className="col-span-3 sm:col-span-2"
                            >
                                <Link
                                    to="/study"
                                    className="group relative p-2.5 xs:p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#F1E7DF] hover:border-[#FF5A36]/50 shadow-[0_2px_8px_rgba(36,50,74,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_20px_rgba(36,50,74,0.07)] hover:-translate-y-0.5 active:translate-y-0 transition-[border-color,box-shadow,transform] duration-150 flex flex-col justify-between h-[76px] sm:h-[88px]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71839B] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                    <p className="text-left text-[11px] sm:text-xs font-bold text-[#24324A] group-hover:text-[#FF5A36] transition-colors leading-tight">
                                        <span className="font-black">Study.</span>{" "}
                                        <span className="font-normal text-[#71839B]">Learn together.</span>
                                    </p>
                                </Link>
                            </m.div>

                            {/* Ambient Key: S (1 col) */}
                            <div className="flex h-[76px] sm:h-[88px] rounded-xl sm:rounded-2xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-xs font-mono text-[#71839B]/40">
                                S
                            </div>

                            {/* ROW 3: [TILE 3: Housing (2 cols)] + [TILE 4: Dining (2 cols)] */}
                            {/* TILE 3: HOUSING */}
                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.22 }}
                                className="col-span-2 sm:col-span-2"
                            >
                                <Link
                                    to="/housing"
                                    className="group relative p-2.5 xs:p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#F1E7DF] hover:border-[#FF5A36]/50 shadow-[0_2px_8px_rgba(36,50,74,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_20px_rgba(36,50,74,0.07)] hover:-translate-y-0.5 active:translate-y-0 transition-[border-color,box-shadow,transform] duration-150 flex flex-col justify-between h-[76px] sm:h-[88px]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                            <House className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71839B] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                    <p className="text-left text-[11px] sm:text-xs font-bold text-[#24324A] group-hover:text-[#FF5A36] transition-colors leading-tight">
                                        <span className="font-black">Housing.</span>{" "}
                                        <span className="font-normal text-[#71839B]">Stay nearby.</span>
                                    </p>
                                </Link>
                            </m.div>

                            {/* TILE 4: DINING */}
                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.28 }}
                                className="col-span-2 sm:col-span-2"
                            >
                                <Link
                                    to="/food"
                                    className="group relative p-2.5 xs:p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#F1E7DF] hover:border-[#FF5A36]/50 shadow-[0_2px_8px_rgba(36,50,74,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_20px_rgba(36,50,74,0.07)] hover:-translate-y-0.5 active:translate-y-0 transition-[border-color,box-shadow,transform] duration-150 flex flex-col justify-between h-[76px] sm:h-[88px]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                            <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71839B] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                    <p className="text-left text-[11px] sm:text-xs font-bold text-[#24324A] group-hover:text-[#FF5A36] transition-colors leading-tight">
                                        <span className="font-black">Dining.</span>{" "}
                                        <span className="font-normal text-[#71839B]">What’s open.</span>
                                    </p>
                                </Link>
                            </m.div>

                            {/* ROW 4: [Shift Key (1 col)] + [TILE 5: Lost & Found (3 cols)] + [X Key (1 col on sm)] */}
                            <div className="flex h-[68px] sm:h-[76px] rounded-xl sm:rounded-2xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-xs font-mono text-[#71839B]/40">
                                ⇧
                            </div>

                            {/* TILE 5: LOST & FOUND */}
                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.45, delay: 0.34 }}
                                className="col-span-3 sm:col-span-3"
                            >
                                <Link
                                    to="/lost-found"
                                    className="group relative p-2.5 xs:p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-[#F1E7DF] hover:border-[#FF5A36]/50 shadow-[0_2px_8px_rgba(36,50,74,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_20px_rgba(36,50,74,0.07)] hover:-translate-y-0.5 active:translate-y-0 transition-[border-color,box-shadow,transform] duration-150 flex items-center justify-between h-[68px] sm:h-[76px]"
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-3 text-left">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36] shrink-0">
                                            <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <p className="text-[11px] sm:text-xs font-bold text-[#24324A] group-hover:text-[#FF5A36] transition-colors leading-tight">
                                            <span className="font-black">Lost & Found.</span>{" "}
                                            <span className="font-normal text-[#71839B]">Find what went missing.</span>
                                        </p>
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71839B] group-hover:text-[#FF5A36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1.5" />
                                </Link>
                            </m.div>

                            {/* Ambient Key: X (Desktop only) */}
                            <div className="hidden sm:flex h-[76px] rounded-2xl border border-[#F1E7DF]/60 bg-white/40 items-center justify-center text-sm font-mono text-[#71839B]/40">
                                X
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
