import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShoppingBag, Utensils, Heart, BookOpen, Coffee, Pizza, Bike, Laptop, Gamepad, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/images/hero-campus.png";
import { cn } from "@/lib/utils";   

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Parallax Transforms - Optimized for responsiveness
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    // Independent floating speeds
    const yFloating1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const yFloating2 = useTransform(scrollYProgress, [0, 1], ["0%", "-120%"]);
    const yFloating3 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
    const yFloating4 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    return (
        <section ref={containerRef} className="relative w-full min-h-screen bg-background pt-20 lg:pt-0 overflow-x-hidden">
            <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-8 lg:gap-16 lg:px-8 items-center">

                {/* LEFT COLUMN: Content (Strict Layout, Z-20 to sit on top) */}
                <div className="relative z-20 flex flex-col justify-center pt-8 text-center md:items-start md:text-left lg:pt-0 pb-16 lg:pb-0">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-6 lg:space-y-8"
                    >
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="inline-flex items-center justify-center rounded-full border border-brand-navy/10 bg-brand-yellow/20 px-4 py-1.5 text-sm font-bold tracking-wide text-brand-navy md:justify-start"
                        >
                            <span className="mr-2 h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                            LIVE AT 50+ CAMPUSES
                        </motion.div>

                        {/* Typography scaled down for safety, but kept high-impact */}
                        <motion.h1
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                            className="text-5xl font-black tracking-tighter text-brand-navy sm:text-6xl md:text-5xl lg:text-7xl xl:text-8xl break-words"
                        >
                            EVERYTHING. <br />
                            <span className="text-brand-orange">UNIVERSITY.</span>
                        </motion.h1>

                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: "easeOut" } } }}
                            className="mx-auto max-w-lg text-lg font-medium text-brand-blue sm:text-2xl md:mx-0 lg:max-w-md xl:max-w-lg"
                        >
                            The all-in-one marketplace, social hub, and food portal for your campus.
                            Only for verifiable students.
                        </motion.p>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } } }}
                            className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="h-14 lg:h-16 rounded-full bg-brand-orange px-8 lg:px-10 text-lg lg:text-xl font-bold text-white shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all">
                                    Join Now
                                    <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6" />
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="lg" className="h-14 lg:h-16 rounded-full border-2 border-brand-navy text-lg lg:text-xl font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                                    Sell Item
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* MOBILE: Rotating Orbit (Behind Text) */}
                    <div className="absolute inset-0 pointer-events-none md:hidden z-10 flex items-center justify-center overflow-hidden">
                        {/* Orbit Container 1 (Clockwise) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute h-[60vh] w-[60vh] rounded-full border border-brand-navy/5"
                        >
                            <div className="absolute top-0 left-1/2 -ml-3 -mt-3">
                                <Pizza className="h-8 w-8 text-brand-orange rotate-180" />
                            </div>
                            <div className="absolute bottom-0 left-1/2 -ml-3 -mb-3">
                                <BookOpen className="h-8 w-8 text-brand-navy" />
                            </div>
                        </motion.div>

                        {/* Orbit Container 2 (Counter-Clockwise) */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute h-[40vh] w-[40vh] rounded-full border border-dashed border-brand-navy/10"
                        >
                            <div className="absolute top-1/2 right-0 -mr-3 -mt-3">
                                <Laptop className="h-6 w-6 text-brand-blue" />
                            </div>
                            <div className="absolute top-1/2 left-0 -ml-3 -mt-3">
                                <Gamepad className="h-6 w-6 text-brand-pink" />
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Visuals (Desktop/Tablet Only - Parallax) */}
                <div className="relative hidden flex-col justify-center md:flex h-full z-10">
                    {/* Main Image Container */}
                    <motion.div
                        style={{ y: yBg }}
                        className="relative z-10 mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg"
                    >
                        <motion.div
                            initial={{ clipPath: "inset(100% 0 0 0)" }}
                            whileInView={{ clipPath: "inset(0 0 0 0)" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl ring-1 ring-black/5"
                        >
                            <img
                                src={heroImage}
                                alt="University Campus Life"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-brand-navy/30 to-transparent mix-blend-multiply" />
                        </motion.div>
                    </motion.div>

                    {/* Floating Stickers (Table/Desktop Layer) */}
                    <div className="absolute inset-0 z-20 pointer-events-none">

                        {/* 1. Book (Top Left) */}
                        <motion.div
                            style={{ y: yFloating2 }}
                            initial={{ opacity: 0, scale: 0, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-[8%] left-[0%] lg:-left-[5%] flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-white shadow-xl ring-4 ring-brand-yellow rotate-[-5deg]"
                        >
                            <BookOpen className="h-8 w-8 lg:h-10 lg:w-10 text-brand-navy" />
                        </motion.div>

                        {/* 2. Pizza (Top Right) */}
                        <motion.div
                            style={{ y: yFloating1 }}
                            initial={{ opacity: 0, scale: 0, rotate: 10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-[18%] right-0 lg:-right-[8%] flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-brand-orange shadow-xl rotate-[10deg]"
                        >
                            <Pizza className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                        </motion.div>

                        {/* 3. Social Badge (Bottom Left) */}
                        <motion.div
                            style={{ y: yFloating3 }}
                            initial={{ opacity: 0, scale: 0, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.7 }}
                            className="absolute bottom-[25%] left-0 lg:left-[5%] flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 lg:px-6 lg:py-3 shadow-xl ring-2 ring-brand-pink"
                        >
                            <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-brand-pink fill-brand-pink" />
                            <span className="font-bold text-sm lg:text-base text-brand-navy">Social</span>
                        </motion.div>

                        {/* 4. Coffee (Bottom Right) */}
                        <motion.div
                            style={{ y: yFloating2 }}
                            initial={{ opacity: 0, scale: 0, rotate: 15 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.9 }}
                            className="absolute bottom-[10%] right-0 lg:right-[5%] flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-3xl bg-brand-navy shadow-2xl rotate-[6deg]"
                        >
                            <Coffee className="h-10 w-10 lg:h-12 lg:w-12 text-brand-yellow" />
                        </motion.div>

                        {/* Background elements (z-[-1] relative to this container which is z-10) */}
                        <motion.div
                            style={{ y: yFloating4 }}
                            className="absolute top-[5%] left-[45%] flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/20 backdrop-blur-sm -z-10"
                        >
                            <Bike className="h-8 w-8 text-brand-blue" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
