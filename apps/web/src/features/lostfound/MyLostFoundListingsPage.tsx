import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { Loader2, ArrowUp, Search, Trash2, Edit, Plus, MapPin, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import "./lostfound.css";

interface LostFoundItem {
    id: string;
    itemName: string;
    description: string;
    type: "lost" | "found";
    location: string;
    imageUrl: string;
    status: string;
    createdAt: string;
}

interface LostFoundResponse {
    items: LostFoundItem[];
    hasMore: boolean;
}

const TYPE_ACCENT: Record<string, string> = {
    lost: "#b3261e",
    found: "#1f8a63",
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

/* ── Lost & Found Listing Card ── */
function LostFoundListingCard({
    item,
    onDelete,
}: {
    item: LostFoundItem;
    onDelete: () => void;
}) {
    const navigate = useNavigate();

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lf-card"
            style={
                { "--lf-accent": TYPE_ACCENT[item.type] ?? "#6b6760" } as React.CSSProperties
            }
        >
            <div className="lf-media">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.itemName} />
                ) : (
                    <span className="lf-media-empty">
                        <Search size={28} strokeWidth={1.4} />
                    </span>
                )}

                <span className="lf-chip">{item.type}</span>
                {item.status && (
                    <span className="lf-status">
                        {item.status === "resolved" ? "Resolved" : "Active"}
                    </span>
                )}
            </div>

            <div className="lf-body">
                <h3 className="lf-name">{item.itemName}</h3>

                <p className="lf-loc">
                    <MapPin size={12} />
                    <span>{item.location}</span>
                </p>

                {item.description && <p className="lf-desc">{item.description}</p>}

                <div className="lf-foot">
                    <span>
                        <Calendar size={12} />
                        {formatDate(item.createdAt)}
                    </span>
                </div>

                <div className="lf-actions">
                    <Link to={`/lost-found/${item.id}`} className="lf-action">
                        <Search size={12} /> View
                    </Link>
                    <button
                        type="button"
                        className="lf-action"
                        onClick={() => navigate(`/lost-found/edit/${item.id}`)}
                    >
                        <Edit size={12} /> Edit
                    </button>
                    <button type="button" className="lf-action danger" onClick={onDelete}>
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>
        </m.div>
    );
}

export function MyLostFoundListingsPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<LostFoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const offsetRef = useRef(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        if (reset) setLoading(true);
        else setLoadingMore(true);
        const off = reset ? 0 : offsetRef.current;
        try {
            const res: LostFoundResponse = await api.get(
                `/lostfound/my-listings?limit=${LIMIT}&offset=${off}`
            );
            if (reset) {
                setItems(res.items);
                offsetRef.current = LIMIT;
            } else {
                setItems((prev) => [...prev, ...res.items]);
                offsetRef.current += LIMIT;
            }
            setHasMore(res.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchItems(true);
    }, [fetchItems]);

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        try {
            await api.delete(`/lostfound/${itemId}`);
            setItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete listing. Please try again.");
        }
    };

    return (
        <div className="um-editorial um-lostfound">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>02</span>/ My listings
                    </p>
                    <h1 className="page-title">
                        Your <span>reports.</span>
                    </h1>
                    <p className="page-lead">
                        Manage and monitor the items you have reported on campus.
                    </p>
                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={() => navigate("/lost-found/report")}
                >
                    <Plus size={16} /> Report new item
                </button>
            </header>

            {!loading && items.length > 0 && (
                <div className="lf-toolbar">
                    <p className="meta-mono">
                        Showing {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="lf-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="lf-skeleton">
                            <div className="lf-skeleton-line" />
                            <div className="lf-skeleton-line short" />
                            <div className="lf-skeleton-line tiny" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="empty-state"
                >
                    <span className="empty-icon">
                        <Search size={24} strokeWidth={1.5} />
                    </span>
                    <h3>No listings yet</h3>
                    <p>Start reporting items to see them here.</p>
                    <button
                        type="button"
                        className="button button-primary"
                        onClick={() => navigate("/lost-found/report")}
                    >
                        Report your first item
                    </button>
                </m.div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <div className="lf-grid">
                        {items.map((item) => (
                            <LostFoundListingCard
                                key={item.id}
                                item={item}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {hasMore && !loading && items.length > 0 && (
                <div className="lf-load-more">
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => fetchItems(false)}
                        disabled={loadingMore}
                    >
                        {loadingMore && <Loader2 size={16} className="animate-spin" />}
                        Load more items
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showScrollTop && (
                    <m.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        aria-label="Scroll to top"
                        className="lf-fab"
                    >
                        <ArrowUp size={20} strokeWidth={2} />
                    </m.button>
                )}
            </AnimatePresence>
        </div>
    );
}
