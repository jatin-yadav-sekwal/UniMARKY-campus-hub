import { useRef } from "react";
import { m, useInView } from "motion/react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, ShieldCheck, Quote, ArrowRight, Users } from "lucide-react";

export function CommunitySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            id="community"
            ref={sectionRef}
            className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-[#FFFCF8] text-[#24324A] border-t border-[#F1E7DF]"
        >
            {/* Ambient Background Grid Texture & Diffuse Warm Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#24324A04_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] bg-gradient-to-b from-[#FFE1D2]/25 via-[#FFF7EF]/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

            <div className="container max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                
                {/* 1. EDITORIAL SECTION HEADER */}
                <div className="max-w-xl mx-auto text-center mb-10 sm:mb-14 space-y-2.5">
                    <m.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#F1E7DF] shadow-2xs mb-0.5"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                            Campus Communities
                        </span>
                        <Sparkles className="w-3 h-3 text-[#FF713F] opacity-75" />
                    </m.div>

                    <m.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="text-2xl sm:text-3xl lg:text-[40px] font-black tracking-tight leading-[1.06] text-[#24324A]"
                    >
                        Find your people.{" "}
                        <span className="bg-gradient-to-r from-[#FF5A36] to-[#FF713F] bg-clip-text text-transparent">
                            Build your circle.
                        </span>
                    </m.h2>

                    <m.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.45, delay: 0.16 }}
                        className="text-xs sm:text-sm text-[#71839B] max-w-md mx-auto font-normal leading-relaxed"
                    >
                        Join societies, study circles and interest groups. Share updates, ask questions and plan meetups — all inside your university.
                    </m.p>
                </div>

                {/* 2. ASYMMETRIC COMMUNITY VOICES COMPOSITION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                    
                    {/* PRIMARY SPOTLIGHT VOICE (Col 1-7) */}
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-[#F1E7DF] shadow-[0_4px_24px_rgba(36,50,74,0.04)] hover:shadow-[0_12px_32px_rgba(36,50,74,0.07)] hover:border-[#FF5A36]/40 hover:-translate-y-0.5 transition-[border-color,box-shadow,transform] duration-200 flex flex-col justify-between group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5EC] text-[#FF5A36] text-[10px] font-bold border border-[#F1E7DF]">
                                    <ShieldCheck className="w-3 h-3 text-[#20BFA3]" />
                                    <span>Verified Members</span>
                                </span>
                                <Quote className="w-5 h-5 text-[#F1E7DF] group-hover:text-[#FF5A36]/30 transition-colors" />
                            </div>

                            <p className="text-base sm:text-lg lg:text-xl font-bold text-[#24324A] leading-snug">
                                "Found my algorithms study circle on day one. We meet twice a week, share notes, and prep for placements together."
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#F1E7DF] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-[#F1E7DF]">
                                    <AvatarFallback className="bg-gradient-to-br from-[#FF5A36] to-[#FF713F] text-white font-bold text-xs">
                                        AS
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <h4 className="text-xs sm:text-sm font-bold text-[#24324A] leading-tight">
                                        Aarav Sharma
                                    </h4>
                                    <p className="text-[11px] text-[#71839B]">CSE · Class of '25</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A36]">
                                <Users className="w-3 h-3" />
                                Study Circle
                            </span>
                        </div>
                    </m.div>

                    {/* SUPPORTING VOICES (Col 8-12 Stacked) */}
                    <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 justify-between">
                        
                        {/* SUPPORTING VOICE 1: CREATORS */}
                        <m.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            transition={{ duration: 0.55, delay: 0.18 }}
                            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-[0_4px_20px_rgba(36,50,74,0.03)] hover:shadow-[0_10px_28px_rgba(36,50,74,0.06)] hover:border-[#FF5A36]/40 hover:-translate-y-0.5 transition-[border-color,box-shadow,transform] duration-200 flex flex-col justify-between flex-1 group"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-[#24324A] leading-relaxed mb-4 text-left">
                                "Posted a design jam in the Creators Collective and 30 students showed up. Easiest way to find collaborators on campus."
                            </p>

                            <div className="pt-3 border-t border-[#F1E7DF] flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-7 w-7 border border-[#F1E7DF]">
                                        <AvatarFallback className="bg-gradient-to-br from-[#FF713F] to-[#FF4F6D] text-white font-bold text-[10px]">
                                            PV
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <h4 className="text-xs font-bold text-[#24324A] leading-tight">
                                            Priya Verma
                                        </h4>
                                        <p className="text-[10px] text-[#71839B]">Design · 2nd Year</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#71839B]">Creators</span>
                            </div>
                        </m.div>

                        {/* SUPPORTING VOICE 2: SPORTS */}
                        <m.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            transition={{ duration: 0.55, delay: 0.24 }}
                            className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-[0_4px_20px_rgba(36,50,74,0.03)] hover:shadow-[0_10px_28px_rgba(36,50,74,0.06)] hover:border-[#FF5A36]/40 hover:-translate-y-0.5 transition-[border-color,box-shadow,transform] duration-200 flex flex-col justify-between flex-1 group"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-[#24324A] leading-relaxed mb-4 text-left">
                                "Our football club plans every practice and match here. No more scattered WhatsApp groups or lost updates."
                            </p>

                            <div className="pt-3 border-t border-[#F1E7DF] flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-7 w-7 border border-[#F1E7DF]">
                                        <AvatarFallback className="bg-gradient-to-br from-[#24324A] to-[#71839B] text-white font-bold text-[10px]">
                                            RM
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <h4 className="text-xs font-bold text-[#24324A] leading-tight">
                                            Rohit Meena
                                        </h4>
                                        <p className="text-[10px] text-[#71839B]">Electrical · 4th Year</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#71839B]">Sports Club</span>
                            </div>
                        </m.div>
                    </div>
                </div>

                {/* 3. PRIMARY CTA */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 sm:mt-12 flex justify-center"
                >
                    <Link
                        to="/communities"
                        className="group inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#FF713F] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(255,90,54,0.25)] hover:shadow-[0_8px_28px_rgba(255,90,54,0.38)] active:shadow-none transition-shadow duration-200"
                    >
                        Explore Communities
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                </m.div>
            </div>
        </section>
    );
}