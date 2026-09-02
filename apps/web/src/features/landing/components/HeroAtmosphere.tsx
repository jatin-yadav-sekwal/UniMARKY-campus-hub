import { useEffect, useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";

export function HeroAtmosphere() {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    // Subtle scroll depth: moves atmosphere slightly upward on initial scroll (max 14px on desktop, 8px on mobile)
    const { scrollY } = useScroll();
    const scrollParallax = useTransform(scrollY, [0, 600], [0, -12]);

    // Spring-like Pointer tracking with RAF inertia (active on desktop only)
    const layer1Ref = useRef<HTMLDivElement>(null);
    const layer2Ref = useRef<HTMLDivElement>(null);
    const layer3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (prefersReducedMotion) return;

        // Strictly disable pointer tracking for touch / coarse pointers and screen width < 1024px
        if (
            typeof window === "undefined" ||
            window.innerWidth < 1024 ||
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId: number;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Normalized offset from center (-1 to 1)
            targetX = (e.clientX - centerX) / (rect.width / 2);
            targetY = (e.clientY - centerY) / (rect.height / 2);
        };

        const updateInertia = () => {
            // Smooth physical lerp with mass/lag (0.04 factor)
            currentX += (targetX - currentX) * 0.04;
            currentY += (targetY - currentY) * 0.04;

            // Apply bounded subtle offsets to each wave layer
            if (layer1Ref.current) {
                layer1Ref.current.style.transform = `translate3d(${(currentX * 4).toFixed(2)}px, ${(currentY * 4).toFixed(2)}px, 0)`;
            }
            if (layer2Ref.current) {
                layer2Ref.current.style.transform = `translate3d(${(-currentX * 8).toFixed(2)}px, ${(-currentY * 8).toFixed(2)}px, 0)`;
            }
            if (layer3Ref.current) {
                layer3Ref.current.style.transform = `translate3d(${(currentX * 12).toFixed(2)}px, ${(currentY * 12).toFixed(2)}px, 0)`;
            }

            rafId = requestAnimationFrame(updateInertia);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        rafId = requestAnimationFrame(updateInertia);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, [prefersReducedMotion]);

    return (
        <m.div
            ref={containerRef}
            style={{ y: prefersReducedMotion ? 0 : scrollParallax }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
            {/* Ambient Background Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#24324A05_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:36px_36px] opacity-60" />

            {/* Ambient Diffuse Warmth Glow Fields */}
            <div className="absolute -top-16 sm:-top-28 left-1/2 -translate-x-1/2 w-[340px] sm:w-[720px] lg:w-[1040px] h-[300px] sm:h-[460px] bg-gradient-to-b from-[#FFE1D2]/45 via-[#FFF7EF]/35 to-transparent rounded-full blur-[80px] sm:blur-[110px]" />
            <div className="absolute top-1/4 -right-16 sm:-right-24 w-[280px] sm:w-[480px] lg:w-[720px] h-[260px] sm:h-[400px] bg-gradient-to-bl from-[#FF5A36]/14 via-[#FF4F6D]/12 to-transparent rounded-full blur-[70px] sm:blur-[100px]" />

            {/* =========================================================================
                CONTINUOUS FLOWING SEAMLESS ZIG-ZAG WAVES (RIGHT TO LEFT MOTION)
                True 3-Period Seamless Loop (4320px wide canvas, 1440px period)
                Optimized for Mobile, Tablet, and Desktop Rendering
               ========================================================================= */}
            <div className="absolute inset-0 w-full h-full flex items-center">
                
                {/* -------------------------------------------------------------
                    WAVE 1 (Back Layer): Soft, Wide Orange -> Crimson Red -> Coral
                    Duration: 44s, Initial Phase Offset: 0%
                   ------------------------------------------------------------- */}
                <div ref={layer1Ref} className="absolute inset-0">
                    <m.div
                        className="absolute inset-y-0 left-0 w-[300%] min-w-[4320px] h-full"
                        animate={
                            prefersReducedMotion
                                ? {}
                                : {
                                      x: ["0%", "-33.333333%"],
                                  }
                        }
                        transition={{
                            repeat: Infinity,
                            duration: 44,
                            ease: "linear",
                        }}
                    >
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 4320 800"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="seamlessGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    {/* Period 1 */}
                                    <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.85" />
                                    <stop offset="11%" stopColor="#FF3366" stopOpacity="0.9" />
                                    <stop offset="22%" stopColor="#FF4F6D" stopOpacity="0.85" />
                                    <stop offset="33.333%" stopColor="#FF5A36" stopOpacity="0.85" />
                                    {/* Period 2 */}
                                    <stop offset="44.333%" stopColor="#FF3366" stopOpacity="0.9" />
                                    <stop offset="55.333%" stopColor="#FF4F6D" stopOpacity="0.85" />
                                    <stop offset="66.666%" stopColor="#FF5A36" stopOpacity="0.85" />
                                    {/* Period 3 */}
                                    <stop offset="77.666%" stopColor="#FF3366" stopOpacity="0.9" />
                                    <stop offset="88.666%" stopColor="#FF4F6D" stopOpacity="0.85" />
                                    <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.85" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0,400 
                                   C 140,400 220,640 360,640 
                                   C 500,640 580,160 720,160 
                                   C 860,160 940,660 1080,660 
                                   C 1220,660 1300,400 1440,400 
                                   C 1580,400 1660,640 1800,640 
                                   C 1940,640 2020,160 2160,160 
                                   C 2300,160 2380,660 2520,660 
                                   C 2660,660 2740,400 2880,400 
                                   C 3020,400 3100,640 3240,640 
                                   C 3380,640 3460,160 3600,160 
                                   C 3740,160 3820,660 3960,660 
                                   C 4100,660 4180,400 4320,400"
                                fill="none"
                                stroke="url(#seamlessGrad1)"
                                strokeWidth="85"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="blur-xl sm:blur-2xl opacity-35"
                            />
                        </svg>
                    </m.div>
                </div>

                {/* -------------------------------------------------------------
                    WAVE 2 (Middle Layer): Vibrant Coral -> Crimson -> Magenta Pink
                    Duration: 34s, Initial Phase Offset: ~31% (-446px)
                   ------------------------------------------------------------- */}
                <div ref={layer2Ref} className="absolute inset-0">
                    <m.div
                        className="absolute inset-y-0 left-0 w-[300%] min-w-[4320px] h-full"
                        animate={
                            prefersReducedMotion
                                ? {}
                                : {
                                      x: ["-10.333333%", "-43.666666%"],
                                  }
                        }
                        transition={{
                            repeat: Infinity,
                            duration: 34,
                            ease: "linear",
                        }}
                    >
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 4320 800"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="seamlessGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    {/* Period 1 */}
                                    <stop offset="0%" stopColor="#FF713F" stopOpacity="0.85" />
                                    <stop offset="11%" stopColor="#FF4F6D" stopOpacity="0.9" />
                                    <stop offset="22%" stopColor="#D81B60" stopOpacity="0.85" />
                                    <stop offset="33.333%" stopColor="#FF713F" stopOpacity="0.85" />
                                    {/* Period 2 */}
                                    <stop offset="44.333%" stopColor="#FF4F6D" stopOpacity="0.9" />
                                    <stop offset="55.333%" stopColor="#D81B60" stopOpacity="0.85" />
                                    <stop offset="66.666%" stopColor="#FF713F" stopOpacity="0.85" />
                                    {/* Period 3 */}
                                    <stop offset="77.666%" stopColor="#FF4F6D" stopOpacity="0.9" />
                                    <stop offset="88.666%" stopColor="#D81B60" stopOpacity="0.85" />
                                    <stop offset="100%" stopColor="#FF713F" stopOpacity="0.85" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0,240 
                                   C 140,340 220,120 360,120 
                                   C 500,120 580,680 720,680 
                                   C 860,680 940,140 1080,140 
                                   C 1220,140 1300,240 1440,240 
                                   C 1580,340 1660,120 1800,120 
                                   C 1940,120 2020,680 2160,680 
                                   C 2300,680 2380,140 2520,140 
                                   C 2660,140 2740,240 2880,240 
                                   C 3020,340 3100,120 3240,120 
                                   C 3380,120 3460,680 3600,680 
                                   C 3740,680 3820,140 3960,140 
                                   C 4100,140 4180,240 4320,240"
                                fill="none"
                                stroke="url(#seamlessGrad2)"
                                strokeWidth="80"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="blur-lg sm:blur-xl opacity-48"
                            />
                        </svg>
                    </m.div>
                </div>

                {/* -------------------------------------------------------------
                    WAVE 3 (Foreground Layer): Radiant Rose Pink -> Orange Crest
                    Duration: 52s, Initial Phase Offset: ~67% (-964px)
                   ------------------------------------------------------------- */}
                <div ref={layer3Ref} className="absolute inset-0">
                    <m.div
                        className="absolute inset-y-0 left-0 w-[300%] min-w-[4320px] h-full"
                        animate={
                            prefersReducedMotion
                                ? {}
                                : {
                                      x: ["-22.333333%", "-55.666666%"],
                                  }
                        }
                        transition={{
                            repeat: Infinity,
                            duration: 52,
                            ease: "linear",
                        }}
                    >
                        <svg
                            className="w-full h-full overflow-visible"
                            viewBox="0 0 4320 800"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="seamlessGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                    {/* Period 1 */}
                                    <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.8" />
                                    <stop offset="11%" stopColor="#FF3366" stopOpacity="0.85" />
                                    <stop offset="22%" stopColor="#FF7597" stopOpacity="0.85" />
                                    <stop offset="33.333%" stopColor="#FF5A36" stopOpacity="0.8" />
                                    {/* Period 2 */}
                                    <stop offset="44.333%" stopColor="#FF3366" stopOpacity="0.85" />
                                    <stop offset="55.333%" stopColor="#FF7597" stopOpacity="0.85" />
                                    <stop offset="66.666%" stopColor="#FF5A36" stopOpacity="0.8" />
                                    {/* Period 3 */}
                                    <stop offset="77.666%" stopColor="#FF3366" stopOpacity="0.85" />
                                    <stop offset="88.666%" stopColor="#FF7597" stopOpacity="0.85" />
                                    <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0,520 
                                   C 140,240 240,200 380,200 
                                   C 500,200 580,600 720,600 
                                   C 860,600 940,180 1080,180 
                                   C 1200,180 1320,400 1440,520 
                                   C 1580,240 1680,200 1820,200 
                                   C 1940,200 2020,600 2160,600 
                                   C 2300,600 2380,180 2520,180 
                                   C 2640,180 2760,400 2880,520 
                                   C 3020,240 3120,200 3260,200 
                                   C 3380,200 3460,600 3600,600 
                                   C 3740,600 3820,180 3960,180 
                                   C 4080,180 4200,400 4320,520"
                                fill="none"
                                stroke="url(#seamlessGrad3)"
                                strokeWidth="68"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="blur-md sm:blur-lg opacity-60"
                            />
                        </svg>
                    </m.div>
                </div>
            </div>

            {/* Seamless Bottom Gradient Fade into Canvas */}
            <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#FFFCF8] via-[#FFFCF8]/85 to-transparent" />
        </m.div>
    );
}
