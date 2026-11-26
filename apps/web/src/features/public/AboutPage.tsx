import { m } from "motion/react";
import { Users, GraduationCap, Shield, Rocket, Heart, Sparkles } from "lucide-react";
import { PublicShell } from "./PublicShell";

const values = [
    {
        icon: GraduationCap,
        title: "Student-First",
        desc: "Every feature is designed by students, for students. We understand campus life because we live it every day.",
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        desc: "Verified university credentials ensure every user is an authentic peer. Zero bots, zero spam.",
    },
    {
        icon: Rocket,
        title: "All-in-One",
        desc: "Marketplace, study materials, student housing, dining, and recovery radar — all in one living campus network.",
    },
    {
        icon: Heart,
        title: "Community Driven",
        desc: "Built with care for the university network. Every student suggestion directly shapes the platform.",
    },
];

const stats = [
    { value: "100%", label: "Verified students", note: "Campus ID checked", accent: true },
    { value: "5", label: "Core hubs", note: "Trade, Notes, Stay, Dine, Lost", accent: false },
    { value: "0%", label: "Platform fees", note: "Direct peer transactions", accent: false },
    { value: "Instant", label: "Speed", note: "Hyperlocal gate radius", accent: true },
];

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.5 },
};

export function AboutPage() {
    return (
        <PublicShell>
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ About UniMARKY
                    </p>
                    <h1 className="page-title">
                        One platform for <span>everything campus.</span>
                    </h1>
                    <p className="page-lead">
                        UniMARKY was built out of frustration with scattered campus chats and broken
                        bulletin boards. We united student trading, notes, housing, food, and
                        recovery into one seamless digital campus.
                    </p>
                </div>
            </header>

            <section className="pub-section">
                <div className="pub-split">
                    <m.div {...fadeUp} className="pub-copy">
                        <p className="section-label">
                            <span>02</span>/ Our mission
                        </p>
                        <h2>Making campus life frictionless and connected.</h2>
                        <p>
                            We believe university should be about learning, growing, and making
                            lifelong connections — not about struggling to find safe student flats,
                            hunting for syllabus notes, or worrying about textbook marketplace
                            scams.
                        </p>
                        <p>
                            UniMARKY provides an authentic, high-speed ecosystem where verified
                            students trade directly with peers with zero platform commissions.
                        </p>
                    </m.div>

                    <m.div {...fadeUp} className="pub-stats">
                        {stats.map((stat) => (
                            <div key={stat.label} className="pub-stat">
                                <p className={`pub-stat-value${stat.accent ? ' accent' : ''}`}>
                                    {stat.value}
                                </p>
                                <p className="pub-stat-label">{stat.label}</p>
                                <p className="pub-stat-note">{stat.note}</p>
                            </div>
                        ))}
                    </m.div>
                </div>
            </section>

            <section className="pub-section">
                <div className="pub-section-head">
                    <p className="section-label">
                        <span>03</span>/ Principles
                    </p>
                    <h2>The values driving UniMARKY.</h2>
                </div>

                <div className="pub-values">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <m.div
                                key={value.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.45 }}
                                className="pub-value"
                            >
                                <span className="pub-value-icon">
                                    <Icon size={17} strokeWidth={1.6} />
                                </span>
                                <h3>{value.title}</h3>
                                <p>{value.desc}</p>
                            </m.div>
                        );
                    })}
                </div>
            </section>
        </PublicShell>
    );
}
