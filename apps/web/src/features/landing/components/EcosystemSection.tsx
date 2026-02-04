import { motion, useInView } from "motion/react";
import { Link } from "react-router-dom";
import { ShoppingBag, MessageSquare, Megaphone, Search, Utensils, House, ArrowUpRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const features = [
    {
        icon: ShoppingBag,
        title: "Marketplace",
        subtitle: "Buy & Sell",
        desc: "The secure marketplace for textbooks, electronics, and dorm essentials. Verified students only.",
        action: "Start Trading",
        href: "/marketplace",
        gradient: "from-brand-orange to-amber-500",
        bgGradient: "from-brand-orange/10 via-amber-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-brand-orange to-amber-500",
    },
    {
        icon: MessageSquare,
        title: "Unimedia",
        subtitle: "Social Hub",
        desc: "Connect with peers, join clubs, and find your crowd. The heartbeat of campus life.",
        action: "Connect Now",
        href: "/unimedia",
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
        icon: Megaphone,
        title: "Updates",
        subtitle: "Campus News",
        desc: "Real-time announcements from faculty and student bodies. Never miss a deadline.",
        action: "Read Latest",
        href: "/announcements",
        gradient: "from-brand-yellow to-amber-400",
        bgGradient: "from-brand-yellow/10 via-amber-400/5 to-transparent",
        iconBg: "bg-gradient-to-br from-brand-yellow to-amber-400",
    },
    {
        icon: House,
        title: "Housing",
        subtitle: "Accommodation",
        desc: "Find your perfect home away from home. Verified listings from trusted landlords.",
        action: "Find Home",
        href: "/housing",
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
        icon: Search,
        title: "Recovery",
        subtitle: "Lost & Found",
        desc: "Recover lost items or help others find theirs. A community-driven recovery system.",
        action: "Check Listings",
        href: "/lost-found",
        gradient: "from-teal-500 to-emerald-500",
        bgGradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-teal-500 to-emerald-500",
    },
    {
        icon: Utensils,
        title: "Food",
        subtitle: "Nearby Eats",
        desc: "Find the best eats around campus. Menus, specials, and exclusive student discounts.",
        action: "Find Food",
        href: "/food",
        gradient: "from-red-500 to-rose-500",
        bgGradient: "from-red-500/10 via-rose-500/5 to-transparent",
        iconBg: "bg-gradient-to-br from-red-500 to-rose-500",
    }
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            <Link to={feature.href} className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-background border border-border/50 hover:border-border transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    <div className="relative p-8 flex flex-col h-full">
                        {/* Icon */}
                        <div className="flex items-start justify-between mb-6">
                            <motion.div
                                className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-lg`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                className="p-2 rounded-full bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                                {feature.subtitle}
                            </p>
                            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-brand-navy transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 pt-6 border-t border-border/50">
                            <span className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                                {feature.action}
                                <ArrowUpRight className={`w-4 h-4 bg-gradient-to-r ${feature.gradient} text-transparent`} style={{ stroke: "currentColor" }} />
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
        <section id="ecosystem" className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />

            <div ref={sectionRef} className="container px-4 mx-auto relative">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
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
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight mb-6"
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
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        A unified hub for every aspect of campus life. From buying textbooks to finding food—we've got you covered.
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground">
                        More features coming soon.{" "}
                        <Link to="/auth" className="font-semibold text-brand-orange hover:underline underline-offset-4">
                            Join the waitlist →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
