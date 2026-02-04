import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer id="support" className="bg-brand-navy text-white pt-20 pb-10">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-brand-pink via-brand-blue to-teal-400 bg-clip-text text-transparent">
                                UNMARKY
                            </h2>
                        </Link>
                        <p className="text-blue-100 max-w-sm leading-relaxed">
                            The platform designed for the next generation of campus life. Safe, fast, and completely yours.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <SocialIcon icon={Twitter} />
                            <SocialIcon icon={Instagram} />
                            <SocialIcon icon={Linkedin} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">PRODUCT</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">COMPANY</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold tracking-widest text-sm mb-6 text-blue-200">LEGAL</h3>
                        <ul className="space-y-4 text-sm text-blue-100/80">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200/60">
                    <p>© 2024 Unmarky Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="font-medium text-green-400">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon className="w-5 h-5 text-white" />
        </a>
    )
}
