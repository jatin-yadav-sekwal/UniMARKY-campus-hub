import { m } from "motion/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-3xl">
                    <m.div {...fadeUp} className="mb-10 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 text-sm font-semibold mb-4">
                            <ShieldCheck className="w-4 h-4" /> Privacy
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-3">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground">Last updated: February 12, 2026</p>
                    </m.div>

                    <m.div {...fadeUp} className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <Section title="1. Information We Collect">
                            <p>We collect information you provide during registration, including your name, university email address, and university affiliation. We also collect usage data such as pages visited, features used, and device information to improve our services.</p>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>To create and manage your UniMARKY account</li>
                                <li>To verify your student status through university email</li>
                                <li>To facilitate marketplace transactions and communication</li>
                                <li>To display relevant listings (housing, food, study materials)</li>
                                <li>To improve the Platform experience and features</li>
                                <li>To send important notifications about your account and transactions</li>
                            </ul>
                        </Section>

                        <Section title="3. Information Sharing">
                            <p>We do not sell your personal information to third parties. Your information may be shared with:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Other users (your display name, profile info on listings)</li>
                                <li>Service providers who help us operate the Platform</li>
                                <li>Law enforcement if required by law</li>
                            </ul>
                        </Section>

                        <Section title="4. Data Security">
                            <p>We implement industry-standard security measures to protect your data, including encrypted connections (HTTPS), secure authentication via Supabase, and regular security audits. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
                        </Section>

                        <Section title="5. Cookies & Local Storage">
                            <p>We use browser local storage and cookies to maintain your session, remember your preferences, and improve performance. These are essential for the Platform to function properly. We do not use third-party tracking cookies.</p>
                        </Section>

                        <Section title="6. Your Rights">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Access and download your personal data</li>
                                <li>Correct or update your information</li>
                                <li>Delete your account and associated data</li>
                                <li>Opt out of non-essential notifications</li>
                            </ul>
                            <p className="mt-2">To exercise these rights, contact us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-brand-orange hover:underline">jatinyadavsekwal88@gmail.com</a>.</p>
                        </Section>

                        <Section title="7. Data Retention">
                            <p>We retain your data for as long as your account is active. When you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes.</p>
                        </Section>

                        <Section title="8. Children's Privacy">
                            <p>UniMARKY is not intended for use by individuals under the age of 18. We do not knowingly collect information from minors.</p>
                        </Section>

                        <Section title="9. Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Your continued use of the Platform constitutes acceptance of the updated policy.</p>
                        </Section>

                        <Section title="10. Contact Us">
                            <p>If you have any questions about this Privacy Policy, please reach out to us at <a href="mailto:jatinyadavsekwal88@gmail.com" className="text-brand-orange hover:underline">jatinyadavsekwal88@gmail.com</a>.</p>
                        </Section>
                    </m.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-brand-navy mb-2">{title}</h2>
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}
