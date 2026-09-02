import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import file from "@/components/layout/file.svg";

export function Footer() {
    return (
        <footer
            id="support"
            className="sticky bottom-0 left-0 w-full z-0 bg-gradient-to-br from-[#FF5A36] via-[#FF6745] to-[#FF4F6D] text-white pt-16 sm:pt-20 pb-10 sm:pb-12 border-t border-white/20 overflow-hidden"
        >
            {/* Luminous Ambient Background Glow & Dot Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Giant Faint Brand Watermark Backdrop */}
            <h2 className="absolute -bottom-4 sm:-bottom-8 lg:-bottom-12 left-1/2 -translate-x-1/2 text-[90px] sm:text-[160px] lg:text-[230px] font-black tracking-tighter text-white/[0.07] select-none pointer-events-none whitespace-nowrap leading-none">
                unimarky
            </h2>

            <div className="container max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
                {/* Main 4-Column Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 sm:mb-14">
                    
                    {/* 1. BRAND COLUMN (Col 1-5) */}
                    <div className="lg:col-span-5 space-y-3.5 text-left">
                        <Link to="/" className="inline-block" aria-label="UniMARKY Home">
                            <img
                                src={file}
                                alt="UniMARKY Logo"
                                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed max-w-xs">
                            Your campus, connected.
                        </p>
                        <div className="pt-1">
                            <a
                                href="https://www.instagram.com/unimarky/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="UniMARKY Instagram"
                                className="w-8 h-8 rounded-full bg-white/15 border border-white/25 hover:bg-white text-white hover:text-[#FF5A36] flex items-center justify-center transition-[color,background-color,border-color,transform] duration-150 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 inline-flex"
                            >
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* 2. EXPLORE COLUMN (Col 6-7) */}
                    <div className="lg:col-span-3 text-left">
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.16em] mb-3.5">
                            Explore
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
                            <li>
                                <Link to="/marketplace" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link to="/study" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Study Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/housing" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Housing & Stays
                                </Link>
                            </li>
                            <li>
                                <Link to="/food" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Campus Dining
                                </Link>
                            </li>
                            <li>
                                <Link to="/lost-found" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Lost & Found
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. COMPANY COLUMN (Col 8-10) */}
                    <div className="lg:col-span-2 text-left">
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.16em] mb-3.5">
                            Company
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
                            <li>
                                <Link to="/about" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. ACCOUNT COLUMN (Col 11-12) */}
                    <div className="lg:col-span-2 text-left">
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.16em] mb-3.5">
                            Account
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
                            <li>
                                <Link to="/auth" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Sign in
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Create account
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketplace" className="hover:text-white hover:translate-x-0.5 transition-[color,transform] duration-150 inline-block">
                                    Open Portal
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Utility Bar */}
                <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/80">
                    <p className="select-none">
                        © {new Date().getFullYear()} UniMARKY. Built for students.
                    </p>
                    <div className="flex items-center gap-2 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="font-medium text-white">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
