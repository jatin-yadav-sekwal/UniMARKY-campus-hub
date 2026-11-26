import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import {
    Loader2,
    ShoppingBag,
    Search,
    Utensils,
    Home,
    GraduationCap,
    ArrowRight,
    Plus,
    Users,
} from 'lucide-react';
import './dashboard.css';

interface DashboardData {
    marketplace?: { id: string; title?: string }[];
    lostFound?: { id: string; itemName?: string }[];
}

const quickAccessItems = [
    { title: 'Marketplace', href: '/marketplace', desc: 'Buy and sell items', icon: ShoppingBag },
    { title: 'Lost & Found', href: '/lost-found', desc: 'Find missing items', icon: Search },
    { title: 'Study', href: '/study', desc: 'Academic resources', icon: GraduationCap },
    { title: 'Food', href: '/food', desc: 'Campus dining', icon: Utensils },
    { title: 'Housing', href: '/housing', desc: 'Find a place to stay', icon: Home },
    { title: 'Communities', href: '/communities', desc: 'Clubs and groups', icon: Users },
];

export function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="um-editorial um-dashboard">
                <div className="dash-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading your campus...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-dashboard">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Dashboard
                    </p>
                    <h1 className="page-title">
                        Your campus, <span>in one place.</span>
                    </h1>
                    <p className="page-lead">
                        Pick up where you left off — manage your listings, browse campus life and
                        explore everything Unimarky has to offer.
                    </p>
                </div>
                <div className="page-head-meta">
                    <span className="meta-mono">Student workspace</span>
                    <span className="page-head-rule" aria-hidden="true" />
                    <span className="meta-mono">Unimarky / Campus</span>
                </div>
            </header>

            {error && (
                <div className="alert alert-error" role="alert">
                    We couldn’t load your latest activity: {error}
                </div>
            )}

            <div className="dash-grid">
                <SummaryCard
                    title="Marketplace"
                    href="/marketplace/my-listings"
                    secondaryHref="/marketplace/list"
                    secondaryLabel="List new item"
                    unit="saved"
                    data={data?.marketplace}
                    icon={ShoppingBag}
                    tone="market"
                />
                <SummaryCard
                    title="Lost & Found"
                    href="/lost-found/my-listings"
                    secondaryHref="/lost-found/report"
                    secondaryLabel="Report item"
                    unit="reported"
                    data={data?.lostFound}
                    icon={Search}
                    tone="lost"
                />
            </div>

            <section className="dash-section" aria-labelledby="explore-heading">
                <div className="section-head">
                    <p className="section-label" id="explore-heading">
                        <span>02</span>/ Explore campus
                    </p>
                    <span className="rule" aria-hidden="true" />
                    <span className="meta-mono">Six services</span>
                </div>
                <div className="dash-index">
                    {quickAccessItems.map(({ title, href, desc, icon: Icon }, index) => (
                        <Link key={href} to={href} className="index-row">
                            <span className="index-no">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="index-icon">
                                <Icon size={17} strokeWidth={1.6} />
                            </span>
                            <span className="index-copy">
                                <strong>{title}</strong>
                                <small>{desc}</small>
                            </span>
                            <ArrowRight className="index-arrow" size={16} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    href: string;
    data?: { id: string; title?: string; itemName?: string }[];
    icon: React.ElementType;
    unit: string;
    tone: 'market' | 'lost';
    secondaryHref?: string;
    secondaryLabel?: string;
}

function SummaryCard({
    title,
    href,
    data,
    icon: Icon,
    unit,
    tone,
    secondaryHref,
    secondaryLabel,
}: SummaryCardProps) {
    const count = data?.length ?? 0;

    return (
        <article className={`summary ${tone}`}>
            <header className="summary-head">
                <span className="summary-title">
                    <span className="summary-icon">
                        <Icon size={18} strokeWidth={1.6} />
                    </span>
                    {title}
                </span>
                <span className="summary-count">
                    <strong>{String(count).padStart(2, '0')}</strong>
                    <small>{unit}</small>
                </span>
            </header>

            <ul className="summary-list">
                {data && data.length > 0 ? (
                    data.slice(0, 3).map((i) => (
                        <li key={i.id}>
                            <Link to={href}>
                                <span className="dot" aria-hidden="true" />
                                <span className="summary-item-text">{i.title || i.itemName}</span>
                                <ArrowRight className="summary-item-arrow" size={14} />
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="summary-empty">No recent activity yet.</li>
                )}
            </ul>

            <div className="summary-actions">
                <Link to={href} className="summary-link">
                    View all <ArrowRight size={14} />
                </Link>
                {secondaryHref && secondaryLabel && (
                    <Link
                        to={secondaryHref}
                        className="summary-add"
                        aria-label={secondaryLabel}
                        title={secondaryLabel}
                    >
                        <Plus size={15} />
                    </Link>
                )}
            </div>
        </article>
    );
}
