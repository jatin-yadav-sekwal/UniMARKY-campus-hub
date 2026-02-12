import { motion } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Rocket, Heart, GraduationCap, Shield } from "lucide-react";

const values = [
    {
        icon: GraduationCap,
        title: "Student-First",
        desc: "Every feature is designed by students, for students. We understand campus life because we live it.",
        gradient: "from-brand-orange to-amber-500",
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        desc: "Verified university email authentication ensures every user is a real student. No fakes, no scams.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Rocket,
        title: "All-in-One",
        desc: "Why juggle 10 apps when one does it all? Marketplace, food, housing, study — everything in your pocket.",
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        icon: Heart,
        title: "Community Driven",
        desc: "Built with love by the campus community. Every feature request and bug report makes us better.",
        gradient: "from-pink-500 to-rose-500",
    },
];

const teamMembers = [
    { name: "UniMARKY Team", role: "Building for Campus Life", initials: "UM" },
];

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/5 to-transparent" />
                <div className="container px-4 mx-auto relative text-center">
                    <motion.div {...fadeUp}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold mb-6">
                            <Users className="w-4 h-4" /> About Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight mb-6">
                            One Platform for{" "}
                            <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                                Everything Campus
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            UniMARKY was born out of frustration with scattered campus services. We wanted one unified place where students can buy, sell, eat, study, find housing, and connect — without the hassle.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 border-t border-border/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <motion.div {...fadeUp}>
                            <span className="text-xs font-bold tracking-widest text-brand-blue uppercase">Our Mission</span>
                            <h2 className="text-3xl font-black text-brand-navy mt-2 mb-4">
                                Making campus life frictionless
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We believe university should be about learning, growing, and making memories — not about struggling to find a PG, hunting for cheap textbooks, or figuring out where to eat.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                UniMARKY brings every essential service into one beautiful, fast platform — verified and trusted by the student community.
                            </p>
                        </motion.div>
                        <motion.div {...fadeUp} className="flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-brand-orange/10 to-amber-500/5 rounded-2xl p-6 border border-brand-orange/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">2K+</p>
                                    <p className="text-xs text-muted-foreground mt-1">Students</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl p-6 border border-blue-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">6</p>
                                    <p className="text-xs text-muted-foreground mt-1">Modules</p>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-2xl p-6 border border-indigo-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">1</p>
                                    <p className="text-xs text-muted-foreground mt-1">University</p>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 rounded-2xl p-6 border border-pink-500/10 text-center">
                                    <p className="text-3xl font-black text-brand-navy">∞</p>
                                    <p className="text-xs text-muted-foreground mt-1">Possibilities</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-muted/20 border-y border-border/30">
                <div className="container px-4 mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-brand-navy">Our Values</h2>
                        <p className="text-muted-foreground mt-2">The principles that drive every pixel we build.</p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-background rounded-2xl border border-border/40 p-5 text-center hover:border-border/80 transition-colors"
                            >
                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-4`}>
                                    <v.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-brand-navy mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
