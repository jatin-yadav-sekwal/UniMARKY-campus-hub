import { motion, useMotionValue, useTransform, useSpring, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowDown, Sparkles, Zap, Shield, Users } from "lucide-react";
import { useEffect, useRef } from "react";

// Floating object configuration with depth layers
const floatingObjects = [
    // Layer 1 - Far away (subtle movement)
    { id: 1, type: "circle", size: 140, x: "5%", y: "12%", depth: 0.02, color: "bg-gradient-to-br from-brand-orange/30 to-brand-yellow/20", blur: "blur-2xl" },
    { id: 2, type: "ring", size: 100, x: "88%", y: "18%", depth: 0.03, color: "border-brand-yellow/40", blur: "" },
    { id: 3, type: "square", size: 70, x: "94%", y: "60%", depth: 0.025, color: "bg-gradient-to-br from-brand-navy/15 to-brand-navy/5", blur: "blur-xl", rotate: 45 },

    // Layer 2 - Mid distance (moderate movement)  
    { id: 4, type: "circle", size: 250, x: "72%", y: "40%", depth: 0.05, color: "bg-gradient-to-br from-brand-yellow/25 to-brand-orange/15", blur: "blur-3xl" },
    { id: 5, type: "ring", size: 160, x: "2%", y: "50%", depth: 0.04, color: "border-brand-orange/25", blur: "" },
    { id: 6, type: "dots", size: 80, x: "18%", y: "72%", depth: 0.045, color: "bg-brand-navy/20", blur: "" },

    // Layer 3 - Close (more pronounced movement)
    { id: 7, type: "circle", size: 50, x: "12%", y: "25%", depth: 0.08, color: "bg-gradient-to-br from-brand-yellow/40 to-brand-orange/30", blur: "blur-sm" },
    { id: 8, type: "square", size: 35, x: "82%", y: "78%", depth: 0.07, color: "bg-gradient-to-br from-brand-orange/30 to-brand-yellow/20", blur: "", rotate: 20 },
    { id: 9, type: "ring", size: 70, x: "62%", y: "12%", depth: 0.06, color: "border-brand-navy/25", blur: "" },
    { id: 10, type: "circle", size: 30, x: "48%", y: "82%", depth: 0.09, color: "bg-brand-navy/25", blur: "" },
    { id: 11, type: "plus", size: 24, x: "25%", y: "45%", depth: 0.075, color: "text-brand-orange/40", blur: "" },
    { id: 12, type: "plus", size: 18, x: "78%", y: "32%", depth: 0.065, color: "text-brand-navy/30", blur: "" },
];

// Stats for social proof
const stats = [
    { value: "10K+", label: "Active Students", icon: Users },
    { value: "50+", label: "Universities", icon: Shield },
    { value: "100K+", label: "Transactions", icon: Zap },
];

interface FloatingObjectProps {
    obj: typeof floatingObjects[0];
    mouseX: ReturnType<typeof useSpring>;
    mouseY: ReturnType<typeof useSpring>;
}

function FloatingObject({ obj, mouseX, mouseY }: FloatingObjectProps) {
    const x = useTransform(mouseX, (value) => value * obj.depth);
    const y = useTransform(mouseY, (value) => value * obj.depth);

    const baseClasses = `absolute pointer-events-none`;

    const renderShape = () => {
        switch (obj.type) {
            case "circle":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} ${obj.blur} rounded-full`}
                        style={{ width: obj.size, height: obj.size }}
                    />
                );
            case "ring":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} rounded-full border-2`}
                        style={{ width: obj.size, height: obj.size }}
                    />
                );
            case "square":
                return (
                    <div
                        className={`${baseClasses} ${obj.color} ${obj.blur || ""} rounded-xl`}
                        style={{
                            width: obj.size,
                            height: obj.size,
                            transform: obj.rotate ? `rotate(${obj.rotate}deg)` : undefined
                        }}
                    />
                );
            case "dots":
                return (
                    <div className={`${baseClasses} grid grid-cols-3 gap-2`}>
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${obj.color}`} />
                        ))}
                    </div>
                );
            case "plus":
                return (
                    <div className={`${baseClasses} ${obj.color} font-bold`} style={{ fontSize: obj.size }}>
                        +
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="absolute"
            style={{
                left: obj.x,
                top: obj.y,
                x,
                y,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                opacity: { duration: 1.2, delay: obj.id * 0.08 },
                scale: { duration: 1, delay: obj.id * 0.08 },
            }}
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, obj.rotate ? 5 : 0, 0],
                }}
                transition={{
                    duration: 4 + obj.id * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {renderShape()}
            </motion.div>
        </motion.div>
    );
}

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Raw mouse position
    const mouseXRaw = useMotionValue(0);
    const mouseYRaw = useMotionValue(0);

    // Smoothed mouse position with spring physics
    const mouseX = useSpring(mouseXRaw, { stiffness: 40, damping: 25 });
    const mouseY = useSpring(mouseYRaw, { stiffness: 40, damping: 25 });

    // Scroll-based parallax for background
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            mouseXRaw.set(e.clientX - centerX);
            mouseYRaw.set(e.clientY - centerY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseXRaw, mouseYRaw]);

    const scrollToEcosystem = () => {
        const ecosystem = document.getElementById("ecosystem");
        if (ecosystem) {
            ecosystem.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-screen flex flex-col items-center justify-center"
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

            {/* Floating Parallax Objects */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingObjects.map((obj) => (
                    <FloatingObject
                        key={obj.id}
                        obj={obj}
                        mouseX={mouseX}
                        mouseY={mouseY}
                    />
                ))}
            </div>

            {/* Gradient Orbs Background with scroll parallax */}
            <motion.div
                className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-brand-yellow/20 via-brand-orange/10 to-transparent rounded-full blur-3xl"
                style={{
                    x: useTransform(mouseX, (v) => v * 0.015),
                    y: backgroundY,
                }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-brand-orange/15 via-brand-yellow/10 to-transparent rounded-full blur-3xl"
                style={{
                    x: useTransform(mouseX, (v) => v * 0.02),
                    y: useTransform(backgroundY, (v) => -v * 0.5),
                }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-navy/5 to-transparent rounded-full blur-3xl"
            />

            <div className="container px-4 mx-auto text-center z-10 relative flex-1 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-orange/10 to-brand-yellow/10 border border-brand-orange/20 text-sm font-semibold text-brand-navy backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-brand-orange" />
                        Trusted by 10,000+ students across 50+ universities
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85]">
                        <motion.span
                            className="block text-brand-navy"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            EVERYTHING
                        </motion.span>
                        <motion.span
                            className="block bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            UNIVERSITY.
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    The <span className="text-brand-navy font-semibold">decentralized ecosystem</span> for students.
                    Buy, sell, connect, and thrive in a <span className="text-brand-orange font-semibold">verifiable campus network</span>.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            size="lg"
                            onClick={scrollToEcosystem}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy to-brand-navy/90 px-10 py-7 text-lg font-bold shadow-xl shadow-brand-navy/25 hover:shadow-2xl hover:shadow-brand-navy/30 transition-all duration-300 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Portal
                                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-2xl px-10 py-7 text-lg font-bold border-2 border-brand-navy/20 hover:border-brand-navy/40 hover:bg-brand-navy/5 gap-3 backdrop-blur-sm"
                        >
                            <PlayCircle className="w-5 h-5 text-brand-orange" />
                            How it works
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-navy/10 to-brand-navy/5">
                                <stat.icon className="w-5 h-5 text-brand-navy" />
                            </div>
                            <div className="text-left">
                                <p className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight">{stat.value}</p>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.button
                    onClick={scrollToEcosystem}
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-muted-foreground hover:text-brand-navy transition-colors cursor-pointer"
                >
                    <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
                    <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-3 bg-current rounded-full"
                        />
                    </div>
                </motion.button>
            </motion.div>
        </section>
    );
}
