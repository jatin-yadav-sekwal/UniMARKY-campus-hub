import type { ReactNode } from "react";
import { m } from "motion/react";
import { PublicShell } from "./PublicShell";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function PrivacyPage() {
    return (
        <PublicShell>
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Trust & safety
                    </p>
                    <h1 className="page-title">
                        Privacy <span>policy.</span>
                    </h1>
                    <p className="page-lead">
                        Last updated: February 2026 · Built for student data sovereignty.
                    </p>
                </div>
            </header>

            <section className="pub-section">
                <m.div {...fadeUp} className="pub-legal">
                    <Section title="1. Information We Collect">
                        <p>
                            We collect information you provide directly during registration, including
                            your full name, student email address, and university affiliation. We
                            collect minimal device metadata necessary to keep your session secure.
                        </p>
                    </Section>

                    <Section title="2. How We Use Student Data">
                        <ul>
                            <li>
                                To authenticate your student identity via verified institutional
                                email
                            </li>
                            <li>
                                To connect you with peers for marketplace trades, study materials,
                                and housing
                            </li>
                            <li>To prevent spam, unauthorized access, and non-student accounts</li>
                            <li>
                                To send essential transactional notifications about your listings
                            </li>
                        </ul>
                    </Section>

                    <Section title="3. Information Sharing & Zero Ads">
                        <p>
                            We do not sell, rent, or monetize your personal data with third-party
                            advertisers. Your listings and public display name are visible only
                            within your verified campus network.
                        </p>
                    </Section>

                    <Section title="4. Data Security">
                        <p>
                            All communications and database queries are encrypted via
                            industry-standard TLS protocols with strict row-level database
                            security.
                        </p>
                    </Section>

                    <Section title="5. Your Rights & Data Deletion">
                        <p>
                            You have full control over your data. You may download your listing
                            history or request complete account deletion at any time by emailing us
                            at{" "}
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
