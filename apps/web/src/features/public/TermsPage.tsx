import { m } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function TermsPage() {
    return (
        <div className="relative min-h-screen bg-[#FFFCF8] font-sans selection:bg-[#FFE1D2] selection:text-[#FF5A36]">
            <Navbar />

            {/* Main content sits with z-10 above the sticky reveal footer */}
            <main className="relative z-10 bg-[#FFFCF8] shadow-[0_20px_60px_rgba(36,50,74,0.06)]">
                
                {/* Hero */}
                <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative overflow-hidden">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FFE1D2]/35 via-[#FFF7EF]/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative text-center max-w-3xl z-10">
                        <m.div {...fadeUp} className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F1E7DF] shadow-2xs">
                                <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#71839B]">
                                    Legal Terms
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24324A] tracking-tight leading-[1.06]">
                                Terms of Service
                            </h1>

                            <p className="text-xs sm:text-sm text-[#71839B]">
                                Last updated: February 2026 · Governing student peer interactions
                            </p>
                        </m.div>
                    </div>
                </section>

                {/* Legal Body */}
                <section className="pb-24 sm:pb-32">
                    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl">
                        <m.div
                            {...fadeUp}
                            className="p-6 sm:p-10 rounded-3xl bg-white border border-[#F1E7DF] shadow-2xs space-y-8 text-left"
                        >
                            <Section title="1. Acceptance of Terms">
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    By accessing or using UniMARKY, you agree to comply with these terms. UniMARKY is exclusively open to enrolled university students and verified faculty.
                                </p>
                            </Section>

                            <Section title="2. Student Code of Conduct">
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    All peer exchanges, comments, notes, and accommodation listings must adhere to respectful campus guidelines. We enforce zero tolerance for fraudulent listings, academic plagiarism, or abusive conduct.
                                </p>
                            </Section>

                            <Section title="3. Peer-to-Peer Marketplace & Zero Fees">
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    UniMARKY connects buyers and sellers directly on campus with 0% platform commissions. Transactions and hand-to-hand handshakes occur directly between students in safe campus areas.
                                </p>
                            </Section>

                            <Section title="4. Course Materials & Housing">
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    Students uploading summary notes confirm they possess the right to share non-copyrighted study notes. Housing posts must represent genuine rental opportunities near campus grounds.
                                </p>
                            </Section>

                            <Section title="5. Contact & Inquiries">
                                <p className="text-xs sm:text-sm text-[#71839B] leading-relaxed">
                                    For inquiries regarding our terms, please email us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-[#FF5A36] font-semibold hover:underline">jatinyadavsekwal88@gmail.com</a>.
                                </p>
                            </Section>
                        </m.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-[#24324A]">{title}</h2>
            <div>{children}</div>
        </div>
    );
}
