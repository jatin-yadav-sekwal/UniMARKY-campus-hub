import { m } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Clock, MessageCircle, ArrowUpRight } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

const contactInfo = [
    {
        icon: Mail,
        title: "Direct Email",
        detail: "jatinyadavsekwal88@gmail.com",
        href: "mailto:jatinyadavsekwal88@gmail.com",
        actionText: "Send Email",
        sub: "Direct response within 24 hours",
    },
    {
        icon: MapPin,
        title: "Campus Location",
        detail: "Central University of Haryana",
        href: undefined,
        actionText: undefined,
        sub: "Mahendergarh, Haryana 123031",
    },
    {
        icon: Clock,
        title: "Operating Hours",
        detail: "Mon – Sat, 9 AM – 6 PM IST",
        href: undefined,
        actionText: undefined,
        sub: "Student Support Team",
    },
];

export function ContactPage() {
    return (
        <div className="relative min-h-screen bg-[#FFFCF8] font-sans selection:bg-[#FFE1D2] selection:text-[#FF5A36]">
            <Navbar />

            {/* Main content sits with z-10 above the sticky reveal footer */}
            <main className="relative z-10 bg-[#FFFCF8] shadow-[0_20px_60px_rgba(36,50,74,0.06)]">
                
                {/* Hero Section */}
                <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FFE1D2]/35 via-[#FFF7EF]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative text-center max-w-3xl z-10">
                        <m.div {...fadeUp} className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F1E7DF] shadow-2xs">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                                    Student Support
                                </span>
                                <MessageCircle className="w-3 h-3 text-[#FF713F] opacity-75" />
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24324A] tracking-tight leading-[1.06]">
                                We’d love to{" "}
                                <span className="bg-gradient-to-r from-[#FF5A36] to-[#FF713F] bg-clip-text text-transparent">
                                    hear from you.
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-[#71839B] max-w-md mx-auto font-normal leading-relaxed pt-1">
                                Have feedback, found a bug, or want to launch UniMARKY at your campus? Reach out to us directly.
                            </p>
                        </m.div>
                    </div>
                </section>

                {/* Direct Contact Channels */}
                <section className="pb-24 sm:pb-36">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                            {contactInfo.map((info, i) => {
                                const Icon = info.icon;
                                return (
                                    <m.div
                                        key={info.title}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08, duration: 0.45 }}
                                        className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F1E7DF] shadow-2xs text-left space-y-3 hover:shadow-xs hover:border-[#FF5A36]/30 hover:-translate-y-0.5 transition-[border-color,box-shadow,transform] duration-150 flex flex-col justify-between group"
                                    >
                                        <div className="space-y-3">
                                            <div className="w-10 h-10 rounded-2xl bg-[#FFF5EC] border border-[#F1E7DF] flex items-center justify-center text-[#FF5A36]">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#71839B] mb-1">
                                                    {info.title}
                                                </h3>
                                                <p className="text-sm sm:text-base font-bold text-[#24324A] break-all">
                                                    {info.detail}
                                                </p>
                                            </div>
                                            <p className="text-xs text-[#71839B]">{info.sub}</p>
                                        </div>

                                        {info.href && (
                                            <div className="pt-3 border-t border-[#F1E7DF]">
                                                <a
                                                    href={info.href}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A36] group-hover:text-[#FF713F] transition-colors"
                                                >
                                                    <span>{info.actionText}</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        )}
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
