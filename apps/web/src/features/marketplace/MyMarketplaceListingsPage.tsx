import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { Loader2, ArrowUp, ShoppingBag, Trash2, Edit, Tag, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import "./marketplace.css";

interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    condition: string;
    isNegotiable: boolean;
    imageUrl: string;
    createdAt: string;
}

interface MarketplaceResponse {
    items: MarketplaceItem[];
    hasMore: boolean;
    total: number;
}

const conditionLabels: Record<string, string> = {
    "new": "New",
    "like-new": "Like New",
    "great": "Great Condition",
    "good": "Good Condition",
    "fair": "Fair Condition",
    "": "Used",
};

/* ── Marketplace Listing Card ── */
function MarketplaceListingCard({ item, onDelete }: { item: MarketplaceItem; onDelete: () => void }) {
    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mp-card"
        >
            <div className="mp-media">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} />
                ) : (
                    <span className="mp-media-empty">
                        <Tag size={30} strokeWidth={1.4} />
                    </span>
                )}
                <span className={`mp-badge${item.isNegotiable ? '' : ' fixed'}`}>
                    {item.isNegotiable ? "Negotiable" : "Fixed"}
                </span>
            </div>

            <div className="mp-body">
                <div className="mpd-tags">
                    <span className="mpd-tag">{item.category?.replace("-", " ") || "Item"}</span>
                </div>
                <h3>{item.title}</h3>
                {item.description && (
                    <p className="mp-desc">{item.description}</p>
                )}
                <p className="mp-price">₹{parseFloat(item.price).toLocaleString()}</p>
                <div className="mp-meta">
                    <span>{conditionLabels[item.condition] || "Used"}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mp-actions">
                    <Link to={`/marketplace/${item.id}`} className="mp-action">
                        <Tag size={12} /> View
                    </Link>
                    <Link to={`/marketplace/edit/${item.id}`} className="mp-action">
                        <Edit size={12} /> Edit
                    </Link>
                    <button type="button" onClick={onDelete} className="mp-action danger">
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>
        </m.div>
    );
}

export function MyMarketplaceListingsPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const offsetRef = useRef(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        if (reset) setLoading(true); else setLoadingMore(true);
        const off = reset ? 0 : offsetRef.current;
        try {
            const res: MarketplaceResponse = await api.get(`/marketplace/my-listings?limit=${LIMIT}&offset=${off}`);
            if (reset) {
                setItems(res.items);
                offsetRef.current = LIMIT;
            } else {
                setItems(prev => [...prev, ...res.items]);
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
            await api.delete(`/marketplace/${itemId}`);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete listing. Please try again.");
        }
    };

    return (
        <div className="um-editorial um-marketplace">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>02</span>/ My listings
                    </p>
                    <h1 className="page-title">
                        Your <span>listings.</span>
                    </h1>
                    <p className="page-lead">
                        Manage and monitor the items you have put up on the campus marketplace.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button-primary"
                    onClick={() => navigate("/marketplace/list")}
                >
                    <Plus size={16} /> List new item
                </button>
            </header>

            {!loading && items.length > 0 && (
                <div className="mp-toolbar">
                    <p className="meta-mono">
                        Showing {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="mp-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="mp-skeleton">
                            <div className="mp-skeleton-media" />
                            <div className="mp-skeleton-body">
                                <div className="mp-skeleton-line" />
                                <div className="mp-skeleton-line short" />
                            </div>
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
                        <ShoppingBag size={24} strokeWidth={1.5} />
                    </span>
                    <h3>No listings yet</h3>
                    <p>Start listing items to see them here.</p>
                    <button
                        type="button"
                        className="button button-primary"
                        onClick={() => navigate("/marketplace/list")}
                    >
                        List your first item
                    </button>
                </m.div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <div className="mp-grid">
                        {items.map(item => (
                            <MarketplaceListingCard key={item.id} item={item} onDelete={() => handleDeleteItem(item.id)} />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {hasMore && !loading && items.length > 0 && (
                <div className="mp-load-more">
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
                        className="mp-fab"
                    >
                        <ArrowUp size={22} strokeWidth={2} />
                    </m.button>
                )}
            </AnimatePresence>
        </div>
    );
}
