import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, Calendar, Clock, Search, Eye, Loader2, MessageCircle } from 'lucide-react';
import '../lostfound/lostfound.css';

interface ReporterInfo {
    id: string;
    fullName: string;
    mobileNumber: string;
    department: string;
}

interface LostFoundItemDetail {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    reporter: ReporterInfo;
}

const TYPE_ACCENT: Record<string, string> = {
    lost: '#b3261e',
    found: '#1f8a63',
};

export function LostFoundItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<LostFoundItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/lostfound/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="um-editorial um-lf-item">
                <div className="lf-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading report...</span>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="um-editorial um-lf-item">
                <div className="empty-state">
                    <span className="empty-icon">
                        <Search size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{error || "Item not found"}</h3>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate("/lost-found")}
                    >
                        Back to Lost & Found
                    </button>
                </div>
            </div>
        );
    }

    const reportedDate = new Date(item.createdAt);
    const formattedDate = reportedDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = reportedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const isLost = item.type === "lost";
    const accent = TYPE_ACCENT[item.type] ?? '#6b6760';

    return (
        <div
            className="um-editorial um-lf-item"
            style={{ '--lf-accent': accent } as React.CSSProperties}
        >
            <button
                type="button"
                onClick={() => navigate("/lost-found")}
                className="back-link"
            >
                <ArrowLeft size={15} /> Back to Lost & Found
            </button>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lfd-hero"
            >
                <p className="lfd-kicker">
                    {isLost ? "Someone lost this" : "Someone found this"}
                </p>
                <h1 className="lfd-title">{item.itemName}</h1>
                <p className="page-lead" style={{ margin: 0 }}>
                    {isLost
                        ? "If you have it, please get in touch with the reporter."
                        : "If it is yours, please get in touch with the reporter to claim it."}
                </p>
            </m.div>

            {item.imageUrl && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="lfd-media"
                >
                    <img src={item.imageUrl} alt={item.itemName} />
                </m.div>
            )}

            <div className="lfd-meta">
                <div className="lfd-meta-cell">
                    <p className="lfd-label">Date reported</p>
                    <p className="lfd-meta-value">{formattedDate}</p>
                </div>
                <div className="lfd-meta-cell">
                    <p className="lfd-label">Time reported</p>
                    <p className="lfd-meta-value">{formattedTime}</p>
                </div>
                {item.location && (
                    <div className="lfd-meta-cell">
                        <p className="lfd-label">
                            {isLost ? "Last seen location" : "Found at"}
                        </p>
                        <p className="lfd-meta-value">{item.location}</p>
                    </div>
                )}
            </div>

            {item.description && (
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lfd-panel"
                >
                    <p className="lfd-label">Description</p>
                    <p>{item.description}</p>
                </m.div>
            )}

            <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lfd-contact"
            >
                <p className="lfd-label">{isLost ? "Contact if found" : "Contact to claim"}</p>

                <div className="lfd-reporter">
                    <span className="lfd-avatar">
                        <User size={20} strokeWidth={1.6} />
                    </span>
                    <div>
                        <p className="lfd-reporter-name">
                            {item.reporter?.fullName || "Anonymous"}
                        </p>
                        {item.reporter?.department && (
                            <p className="lfd-reporter-dept">{item.reporter.department}</p>
                        )}
                    </div>
                </div>

                {item.reporter?.mobileNumber ? (
                    <a
                        href={`tel:${item.reporter.mobileNumber}`}
                        className="button button-primary button-block"
                    >
                        <Phone size={16} />
                        {item.reporter.mobileNumber}
                    </a>
                ) : (
                    <div className="lfd-no-contact">
                        <MessageCircle size={16} />
                        Contact info not available
                    </div>
                )}
            </m.div>
        </div>
    );
}
