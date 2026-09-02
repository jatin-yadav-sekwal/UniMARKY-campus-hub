import { m } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, GraduationCap, Shield, Rocket, Heart, Sparkles } from "lucide-react";

const values = [
    {
        icon: GraduationCap,
        title: "Student-First",
        desc: "Every feature is designed by students, for students. We understand campus life because we live it every day.",
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        desc: "Verified university credentials ensure every user is an authentic peer. Zero bots, zero spam.",
    },
    {
        icon: Rocket,
        title: "All-in-One",
        desc: "Marketplace, study materials, student housing, dining, and recovery radar — all in one living campus network.",
    },
    {
        icon: Heart,
        title: "Community Driven",
        desc: "Built with care for the university network. Every student suggestion directly shapes the platform.",
    },
];

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function AboutPage() {
    return (
        <div className="relative min-h-screen bg-[#FFFCF8] font-sans selection:bg-[#FFE1D2] selection:text-[#FF5A36]">
            <Navbar />

            {/* Main content sits with z-10 above the sticky reveal footer */}
            <main className="relative z-10 bg-[#FFFCF8] shadow-[0_20px_60px_rgba(36,50,74,0.06)]">
                
                {/* Hero Section */}
                <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 relative overflow-hidden">
                    {/* Ambient Warm Light Glow */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FFE1D2]/35 via-[#FFF7EF]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative text-center max-w-4xl z-10">
                        <m.div {...fadeUp} className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F1E7DF] shadow-2xs">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                                    About UniMARKY
                                </span>
                                <Sparkles className="w-3 h-3 text-[#FF713F] opacity-75" />
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24324A] tracking-tight leading-[1.06]">
                                One Platform for{" "}
                                <span className="bg-gradient-to-r from-[#FF5A36] to-[#FF713F] bg-clip-text text-transparent">
                                    Everything Campus.
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-[#71839B] max-w-xl mx-auto font-normal leading-relaxed pt-2">
                                UniMARKY was built out of frustration with scattered campus chats and broken bulletin boards. We united student trading, notes, housing, food, and recovery into one seamless digital campus.
                            </p>
                        </m.div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 sm:py-20 border-t border-[#F1E7DF]">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
                            <m.div {...fadeUp} className="space-y-4 text-left">
                                <span className="text-[11px] font-bold tracking-[0.18em] text-[#FF5A36] uppercase">
                                    Our Mission
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-[#24324A] tracking-tight leading-snug">
                                    Making campus life frictionless and connected.
                                </h2>
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    We believe university should be about learning, growing, and making lifelong connections — not about struggling to find safe student flats, hunting for syllabus notes, or worrying about textbook marketplace scams.
                                </p>
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    UniMARKY provides an authentic, high-speed ecosystem where verified students trade directly with peers with zero platform commissions.
                                </p>
                            </m.div>

                            <m.div {...fadeUp} className="grid grid-cols-2 gap-3.5 sm:gap-4">
                                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-2xs text-center space-y-1">
                                    <p className="text-2xl sm:text-3xl font-black text-[#FF5A36]">100%</p>
                                    <p className="text-xs font-semibold text-[#24324A]">Verified Students</p>
                                    <p className="text-[10px] text-[#71839B]">Campus ID checked</p>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-2xs text-center space-y-1">
                                    <p className="text-2xl sm:text-3xl font-black text-[#24324A]">5</p>
                                    <p className="text-xs font-semibold text-[#24324A]">Core Hubs</p>
                                    <p className="text-[10px] text-[#71839B]">Trade, Notes, Stay, Dine, Lost</p>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-2xs text-center space-y-1">
                                    <p className="text-2xl sm:text-3xl font-black text-[#24324A]">0%</p>
                                    <p className="text-xs font-semibold text-[#24324A]">Platform Fees</p>
                                    <p className="text-[10px] text-[#71839B]">Direct peer transactions</p>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-2xs text-center space-y-1">
                                    <p className="text-2xl sm:text-3xl font-black text-[#FF713F]">⚡</p>
                                    <p className="text-xs font-semibold text-[#24324A]">Instant Speed</p>
                                    <p className="text-[10px] text-[#71839B]">Hyperlocal gate radius</p>
                                </div>
                            </m.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 sm:py-24 border-t border-[#F1E7DF]">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
                        <m.div {...fadeUp} className="text-center mb-12 sm:mb-16 space-y-2">
                            <span className="text-[11px] font-bold tracking-[0.18em] text-[#FF5A36] uppercase">
                                Principles
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#24324A] tracking-tight">
                                The values driving UniMARKY.
                            </h2>
                        </m.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {values.map((v, i) => {
                                const Icon = v.icon;
                                return (
                                    <m.div
                                        key={v.title}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08, duration: 0.45 }}
                                        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F1E7DF] shadow-2xs hover:shadow-xs hover:border-[#FF5A36]/30 hover:-translate-y-0.5 transition-[border-color,box-shadow,transform] duration-150 text-left flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm sm:text-base font-bold text-[#24324A]">
                                                {v.title}
                                            </h3>
                                            <p className="text-xs text-[#71839B] leading-relaxed">
                                                {v.desc}
                                            </p>
                                        </div>
                                    </m.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
