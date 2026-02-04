import { motion} from "motion/react";
import type { Variants } from "motion/react";
import { ShoppingBag, MessageCircle, Utensils, Search, Bell } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
    {
        title: "Buy & Sell",
        tagline: "Campus commerce, simplified.",
        icon: ShoppingBag,
        colorClass: "text-brand-orange",
        borderColorClass: "hover:ring-brand-orange",
        href: "/market"
    },
    {
        title: "Social",
        tagline: "Connect with your classmates.",
        icon: MessageCircle,
        colorClass: "text-brand-pink",
        borderColorClass: "hover:ring-brand-pink",
        href: "/social"
    },
    {
        title: "Food Portal",
        tagline: "Local flavors, student prices.",
        icon: Utensils,
        colorClass: "text-brand-yellow",
        borderColorClass: "hover:ring-brand-yellow",
        href: "/food"
    },
    {
        title: "Lost & Found",
        tagline: "Reuniting you with your gear.",
        icon: Search,
        colorClass: "text-brand-blue",
        borderColorClass: "hover:ring-brand-blue",
        href: "/lost-found"
    },
    {
        title: "Announcements",
        tagline: "Stay in the loop, always.",
        icon: Bell,
        colorClass: "text-brand-navy",
        borderColorClass: "hover:ring-brand-navy",
        href: "/news"
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeatureGrid() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Section Header */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-brand-orange">
                        Explore the Ecosystem
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
                        Everything you need for <br /> campus life.
                    </p>
                </div>

                {/* Feature Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <FeatureCard {...feature} />
                        </motion.div>
                    ))}

                    {/* 'Coming Soon' Placeholder Card to fill grid if needed */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-navy/20 p-8 text-center bg-brand-navy/5">
                        <span className="text-brand-navy/50 font-bold">More coming soon...</span>
                    </motion.div>

                </motion.div>

            </div>
        </section>
    );
}
