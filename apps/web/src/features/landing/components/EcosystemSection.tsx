import { motion, useInView, useMotionValue, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ShoppingBag, MessageSquare, BookOpen, Search, Utensils, House, ArrowUpRight, Sparkles } from "lucide-react";
import { useRef, useState, useCallback } from "react";

const features = [
    {
        icon: ShoppingBag,
        title: "Marketplace",
        subtitle: "Buy & Sell",
        desc: "Secure marketplace for textbooks, electronics, and dorm essentials.",
        action: "Start Trading",
        href: "/marketplace",
        gradient: "from-brand-orange to-amber-500",
        glowColor: "rgba(249, 115, 22, 0.4)",
    },
    {
        icon: MessageSquare,
        title: "Unimedia",
        subtitle: "Social Hub",
        desc: "Connect with peers, join clubs, and find your crowd on campus.",
        action: "Connect Now",
        href: "/unimedia",
        gradient: "from-blue-500 to-cyan-500",
        glowColor: "rgba(59, 130, 246, 0.4)",
    },
    {
        icon: BookOpen,
        title: "Study",
        subtitle: "Academic Resources",
        desc: "Notes, previous year papers, sessional exams — filtered by department.",
        action: "Explore Resources",
        href: "/study",
        gradient: "from-indigo-500 to-violet-500",
        glowColor: "rgba(99, 102, 241, 0.4)",
    },
    {
        icon: House,
        title: "Housing",
        subtitle: "Accommodation",
        desc: "Find your perfect home away from home with verified listings.",
        action: "Find Home",
        href: "/housing",
        gradient: "from-purple-500 to-pink-500",
        glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
        icon: Search,
        title: "Recovery",
        subtitle: "Lost & Found",
        desc: "Community-driven item recovery system for the campus.",
        action: "Check Listings",
        href: "/lost-found",
        gradient: "from-teal-500 to-emerald-500",
        glowColor: "rgba(20, 184, 166, 0.4)",
    },
    {
        icon: Utensils,
        title: "Food",
        subtitle: "Nearby Eats",
        desc: "Discover the best eats around campus with menus and discounts.",
        action: "Find Food",
        href: "/food",
        gradient: "from-red-500 to-rose-500",
        glowColor: "rgba(239, 68, 68, 0.4)",
    }
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });
    const [hasHovered, setHasHovered] = useState(false);

    // Mouse tracking for glow effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }, [mouseX, mouseY]);

    const handleMouseEnter = () => {
        if (!hasHovered) setHasHovered(true);
    };

    // Transform mouse position to gradient position
    const background = useTransform(
        [mouseX, mouseY],
        ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, ${feature.glowColor}, transparent 70%)`
    );

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            <Link to={feature.href} className="group block h-full">
                <div
                    className="relative h-full overflow-hidden rounded-2xl bg-background border border-border/40 hover:border-border/80 transition-colors duration-300"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                >
                    {/* Mouse-following glow */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background }}
                    />

                    {/* Single-run border light sweep on first hover */}
                    {hasHovered && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${feature.glowColor}, transparent)` }}
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ background: `linear-gradient(90deg, transparent, ${feature.glowColor}, transparent)` }}
                                initial={{ x: "100%" }}
                                animate={{ x: "-100%" }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
                            />
                        </motion.div>
                    )}

                    <div className="relative p-5 sm:p-6 flex flex-col h-full">
                        {/* Top row: Icon + Arrow */}
                        <div className="flex items-center justify-between mb-4">
                            <motion.div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <feature.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <div className="p-1.5 rounded-full bg-muted/30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5">
                                {feature.subtitle}
                            </p>
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-navy transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-3 border-t border-border/30">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-2.5 transition-all duration-300`}>
                                {feature.action}
                                <ArrowUpRight className="w-3 h-3" style={{ color: feature.glowColor }} />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function EcosystemSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="ecosystem" className="relative py-20 md:py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />

            <div ref={sectionRef} className="container px-4 mx-auto relative">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-navy/10 to-brand-navy/5 border border-brand-navy/10 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-brand-navy" />
                        <span className="text-sm font-semibold text-brand-navy">The Ecosystem</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-5"
                    >
                        Everything You Need,{" "}
                        <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                            One Platform
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        A unified hub for every aspect of campus life. From buying textbooks to finding food — we've got you covered.
                    </motion.p>
                </div>

                {/* Feature Grid — compact 3-col */}
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-12 text-center"
                >
                    {/* <p className="text-muted-foreground text-sm">
                        More modules coming soon.{" "}
                        <Link to="/auth" className="font-semibold text-brand-orange hover:underline underline-offset-4">
                            Join the waitlist →
                        </Link>
                    </p> */}
                </motion.div>
            </div>
        </section>
    );
}
