import type { ReactNode } from "react";
import { m } from "motion/react";
import { FileText } from "lucide-react";
import { PublicShell } from "./PublicShell";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function TermsPage() {
    return (
        <PublicShell>
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Legal terms
                    </p>
                    <h1 className="page-title">
                        Terms of <span>service.</span>
                    </h1>
                    <p className="page-lead">
                        Last updated: February 2026 · Governing student peer interactions.
                    </p>
                </div>
            </header>

            <section className="pub-section">
                <m.div {...fadeUp} className="pub-legal">
                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing or using UniMARKY, you agree to comply with these terms.
                            UniMARKY is exclusively open to enrolled university students and
                            verified faculty.
                        </p>
                    </Section>

                    <Section title="2. Student Code of Conduct">
                        <p>
                            All peer exchanges, comments, notes, and accommodation listings must
                            adhere to respectful campus guidelines. We enforce zero tolerance for
                            fraudulent listings, academic plagiarism, or abusive conduct.
                        </p>
                    </Section>

                    <Section title="3. Peer-to-Peer Marketplace & Zero Fees">
                        <p>
                            UniMARKY connects buyers and sellers directly on campus with 0% platform
                            commissions. Transactions and hand-to-hand handshakes occur directly
                            between students in safe campus areas.
                        </p>
                    </Section>

                    <Section title="4. Course Materials & Housing">
                        <p>
                            Students uploading summary notes confirm they possess the right to
                            share non-copyrighted study notes. Housing posts must represent genuine
                            rental opportunities near campus grounds.
                        </p>
                    </Section>

                    <Section title="5. Contact & Inquiries">
                        <p>
                            For inquiries regarding our terms, please email us at{" "}
                            <a href="mailto:jatinyadavsekwal88@gmail.com">
                                jatinyadavsekwal88@gmail.com
                            </a>
                            .
                        </p>
                    </Section>
                </m.div>
            </section>
        </PublicShell>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="pub-legal-section">
            <h2 className="pub-legal-title">{title}</h2>
            <div className="pub-legal-body">{children}</div>
        </div>
    );
}
