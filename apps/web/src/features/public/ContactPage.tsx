import { m } from "motion/react";
import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { PublicShell } from "./PublicShell";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

const contactInfo = [
    {
        icon: Mail,
        title: "Direct email",
        detail: "jatinyadavsekwal88@gmail.com",
        href: "mailto:jatinyadavsekwal88@gmail.com",
        actionText: "Send email",
        sub: "Direct response within 24 hours",
    },
    {
        icon: MapPin,
        title: "Campus location",
        detail: "Central University of Haryana",
        href: undefined,
        actionText: undefined,
        sub: "Mahendergarh, Haryana 123031",
    },
    {
        icon: Clock,
        title: "Operating hours",
        detail: "Mon – Sat, 9 AM – 6 PM IST",
        href: undefined,
        actionText: undefined,
        sub: "Student Support Team",
    },
];

export function ContactPage() {
    return (
        <PublicShell>
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Student support
                    </p>
                    <h1 className="page-title">
                        We’d love to <span>hear from you.</span>
                    </h1>
                    <p className="page-lead">
                        Have feedback, found a bug, or want to launch UniMARKY at your campus? Reach
                        out to us directly.
                    </p>
                </div>
            </header>

            <section className="pub-section">
                <div className="pub-cards">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <m.div
                                key={info.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.45 }}
                                className="pub-card"
                            >
                                <span className="pub-card-icon">
                                    <Icon size={17} strokeWidth={1.6} />
                                </span>

                                <p className="pub-card-label">{info.title}</p>
                                <p className="pub-card-detail">{info.detail}</p>
                                <p className="pub-card-sub">{info.sub}</p>

                                {info.href && (
                                    <a href={info.href} className="pub-card-action">
                                        <span>{info.actionText}</span>
                                        <ArrowUpRight size={14} />
                                    </a>
                                )}
                            </m.div>
                        );
                    })}
                </div>
            </section>
        </PublicShell>
    );
}
