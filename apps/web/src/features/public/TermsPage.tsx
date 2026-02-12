import { motion } from "motion/react";
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
        <div className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-3xl">
                    <motion.div {...fadeUp} className="mb-10 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-semibold mb-4">
                            <FileText className="w-4 h-4" /> Legal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-3">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground">Last updated: February 12, 2026</p>
                    </motion.div>

                    <motion.div {...fadeUp} className="prose prose-neutral max-w-none text-muted-foreground space-y-8">
                        <Section title="1. Acceptance of Terms">
                            <p>By accessing or using UniMARKY ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                        </Section>

                        <Section title="2. Eligibility">
                            <p>UniMARKY is available to currently enrolled students of participating universities. You must use a valid university email address to register. You must be at least 18 years of age to use the Platform.</p>
                        </Section>

                        <Section title="3. User Accounts">
                            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration. UniMARKY reserves the right to suspend or terminate accounts that violate these terms.</p>
                        </Section>

                        <Section title="4. Marketplace Guidelines">
                            <p>Users may list items for sale or trade through the Marketplace. All listings must be for legal items and services. UniMARKY does not facilitate payments directly — all transactions are between buyer and seller. We are not liable for the quality, safety, or legality of listed items.</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>No prohibited items (weapons, drugs, counterfeit goods)</li>
                                <li>Accurate descriptions and images are required</li>
                                <li>Harassment of buyers or sellers is prohibited</li>
                                <li>Pricing must be fair and transparent</li>
                            </ul>
                        </Section>

                        <Section title="5. Content Policy">
                            <p>Users are responsible for all content they post, including listings, reviews, comments, and study materials. Content must not be defamatory, obscene, threatening, or infringing on intellectual property rights. UniMARKY reserves the right to remove any content that violates these guidelines.</p>
                        </Section>

                        <Section title="6. Study Materials">
                            <p>Users who upload study materials confirm they have the right to share such materials. UniMARKY is not responsible for the accuracy of uploaded study content. Copyright-infringing materials will be removed upon notice.</p>
                        </Section>

                        <Section title="7. Housing Listings">
                            <p>Housing listings are provided as-is. UniMARKY does not verify property conditions or landlord credentials beyond basic checks. Users should independently verify accommodation details before committing.</p>
                        </Section>

                        <Section title="8. Limitation of Liability">
                            <p>UniMARKY is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages. Users engage in all transactions at their own risk.</p>
                        </Section>

                        <Section title="9. Modifications">
                            <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email or in-app notification.</p>
                        </Section>

                        <Section title="10. Contact">
                            <p>For questions about these Terms, please contact us at <a href="mailto:support@unimarky.com" className="text-brand-orange hover:underline">support@unimarky.com</a>.</p>
                        </Section>
                    </motion.div>
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
