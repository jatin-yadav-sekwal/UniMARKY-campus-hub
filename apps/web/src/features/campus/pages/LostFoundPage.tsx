import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Eye, Plus, ChevronDown, MapPin, Calendar } from 'lucide-react';
import '../../lostfound/lostfound.css';

interface LostFoundItem {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    reporterName: string;
}

interface LostFoundResponse {
    items: LostFoundItem[];
    hasMore: boolean;
    total: number;
}

const typeFilters = [
    { value: "all", label: "All items" },
    { value: "lost", label: "Lost items" },
    { value: "found", label: "Found items" },
];

const TYPE_ACCENT: Record<string, string> = {
    lost: '#b3261e',
    found: '#1f8a63',
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });
};

export function LostFoundPage() {
    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const offsetRef = useRef(0);
    const [activeType, setActiveType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offsetRef.current;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const typeParam = activeType !== "all" ? `&type=${activeType}` : "";
            const searchParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
            const response: LostFoundResponse = await api.get(
                `/lostfound?limit=${LIMIT}&offset=${currentOffset}${typeParam}${searchParam}`
            );

            if (reset) {
                setItems(response.items);
            } else {
                setItems(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            offsetRef.current = currentOffset + response.items.length;
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeType, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            offsetRef.current = 0;
            fetchItems(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchItems]);

    return (
        <div className="um-editorial um-lostfound">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Lost & found
                    </p>
                    <h1 className="page-title">
                        Lost and <span>found.</span>
                    </h1>
                    <p className="page-lead">
                        Help your campus community by reporting lost items or returning found
                        ones.
                    </p>
                </div>

                <div className="lf-head-actions">
                    <div className="page-head-meta">
                        <span className="meta-mono">Campus reports</span>
                        <span className="page-head-rule" aria-hidden="true" />
                        <span className="meta-mono">
                            {total > 0 ? `${total} reports` : 'Lost & found'}
                        </span>
                    </div>
                    <div className="lf-head-buttons">
                        <Link to="/lost-found/my-listings" className="button button-secondary">
                            My listings
                        </Link>
                        <Link to="/lost-found/report" className="button button-primary">
                            <Plus size={16} /> Report item
                        </Link>
                    </div>
                </div>
            </header>

            <div className="lf-controls">
                <div className="lf-types" role="group" aria-label="Filter by report type">
                {typeFilters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveType(filter.value)}
                        aria-pressed={activeType === filter.value}
                        data-type={filter.value}
                        className={`lf-type${activeType === filter.value ? ' active' : ''}`}
                    >
                        {filter.value !== 'all' && <span className="lf-type-dot" />}
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="lf-toolbar">
                <div className="lf-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search lost items..."
                        aria-label="Search reported items"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="field-input"
                    />
                </div>
            </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lf-grid"
                    >
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="lf-skeleton">
                                <div className="lf-skeleton-media" />
                                <div className="lf-skeleton-body">
                                    <div className="lf-skeleton-line" />
                                    <div className="lf-skeleton-line short" />
                                    <div className="lf-skeleton-line tiny" />
                                </div>
                            </div>
                        ))}
                    </m.div>
                ) : items.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <Search size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No items reported</h3>
                        <p>That's good news! Nothing lost or found yet.</p>
                        <Link to="/lost-found/report" className="button button-primary">
                            Report an item
                        </Link>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lf-grid"
                    >
                        {items.map((item, index) => (
                            <m.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.04 }}
                                layout
                            >
                                <Link
                                    to={`/lost-found/${item.id}`}
                                    className="lf-card"
                                    style={
                                        {
                                            '--lf-accent':
                                                TYPE_ACCENT[item.type] ?? '#6b6760',
                                        } as React.CSSProperties
                                    }
                                >
                                    <div className="lf-media">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.itemName} loading="lazy" decoding="async" />
                                        ) : (
                                            <span className="lf-media-empty">
                                                {item.type === "lost" ? (
                                                    <Search size={28} strokeWidth={1.4} />
                                                ) : (
                                                    <Eye size={28} strokeWidth={1.4} />
                                                )}
                                            </span>
                                        )}

                                        <span className="lf-chip">{item.type}</span>
                                        <span className="lf-status">
                                            {item.status === "open" ? "Active" : "Resolved"}
                                        </span>
                                    </div>

                                    <div className="lf-body">
                                        <h3 className="lf-name">{item.itemName}</h3>

                                        <p className="lf-loc">
                                            <MapPin size={12} />
                                            <span>{item.location}</span>
                                        </p>

                                        {item.description && (
                                            <p className="lf-desc">{item.description}</p>
                                        )}

                                        <div className="lf-foot">
                                            <span className="who">{item.reporterName}</span>
                                            <span>
                                                <Calendar size={12} />
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            {hasMore && items.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="lf-load-more"
                >
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => fetchItems(false)}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <>
                                View more items
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </m.div>
            )}

            {!loading && total > 0 && (
                <p className="meta-mono lf-count">
                    Showing {items.length} of {total} items
                </p>
            )}
        </div>
    );
}
