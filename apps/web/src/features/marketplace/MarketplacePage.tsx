import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Plus, ChevronDown, Tag } from 'lucide-react';
import './marketplace.css';

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

const categories = [
    { value: "all", label: "All Items" },
    { value: "textbooks", label: "Textbooks" },
    { value: "electronics", label: "Electronics" },
    { value: "dorm-decor", label: "Dorm Decor" },
    { value: "fashion", label: "Fashion" },
    { value: "services", label: "Services" },
    { value: "fitness", label: "Fitness" },
];

const conditionLabels: Record<string, string> = {
    new: "Brand New",
    "like-new": "Like New",
    great: "Great Condition",
    good: "Good Condition",
    fair: "Fair Condition",
};

export function MarketplacePage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const offsetRef = useRef(0);
    const [activeCategory, setActiveCategory] = useState("all");
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
            const response: MarketplaceResponse = await api.get(
                `/marketplace?limit=${LIMIT}&offset=${currentOffset}&category=${activeCategory}`
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
    }, [activeCategory]);

    useEffect(() => {
        offsetRef.current = 0;
        fetchItems(true);
    }, [fetchItems]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

    const handleLoadMore = () => {
        fetchItems(false);
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="um-editorial um-marketplace">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Marketplace
                    </p>
                    <h1 className="page-title">
                        Campus <span>deals.</span>
                    </h1>
                    <p className="page-lead">
                        A marketplace for verified students — buy, sell and swap with your campus
                        peers safely.
                    </p>
                </div>
                <div className="mp-head-actions">
                    <div className="page-head-meta">
                        <span className="meta-mono">Campus marketplace</span>
                        <span className="page-head-rule" aria-hidden="true" />
                        <span className="meta-mono">
                            {total > 0 ? `${total} items` : 'Student listings'}
                        </span>
                    </div>
                    <div className="mp-head-buttons">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => navigate("/marketplace/my-listings")}
                        >
                            My listings
                        </button>
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={() => navigate("/marketplace/list")}
                        >
                            <Plus size={16} /> List an item
                        </button>
                    </div>
                </div>
            </header>

            <div className="mp-controls">
                <div className="mp-filters" role="group" aria-label="Filter by category">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryChange(cat.value)}
                        aria-pressed={activeCategory === cat.value}
                        className={`mp-cat${activeCategory === cat.value ? ' active' : ''}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="mp-toolbar">
                <div className="mp-search">
                    <Search size={16} />
                    <input
                        type="text"
                        className="field-input"
                        placeholder="Search textbooks, tech…"
                        aria-label="Search marketplace items"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        className="mp-spinner"
                    >
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading items…</span>
                    </m.div>
                ) : filteredItems.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <Tag size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No items found</h3>
                        <p>{searchQuery ? "Try a different search term." : "Be the first to list an item."}</p>
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={() => navigate("/marketplace/list")}
                        >
                            List your first item
                        </button>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mp-grid"
                    >
                        {filteredItems.map((item, index) => (
                            <m.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.04 }}
                                layout
                            >
                                <Link to={`/marketplace/${item.id}`} className="mp-card">
                                    <div className="mp-media">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
                                        ) : (
                                            <span className="mp-media-empty">
                                                <Tag size={30} strokeWidth={1.4} />
                                            </span>
                                        )}
                                        <span className={`mp-badge${item.isNegotiable ? '' : ' fixed'}`}>
                                            {item.isNegotiable ? 'Negotiable' : 'Fixed price'}
                                        </span>
                                    </div>

                                    <div className="mp-body">
                                        <span className="mp-cat-label">
                                            {item.category?.replace("-", " ")}
                                        </span>
                                        <h3>{item.title}</h3>
                                        <div className="mp-foot">
                                            <p className="mp-price">
                                                ₹{parseFloat(item.price).toLocaleString()}
                                            </p>
                                            <span className="mp-condition">
                                                {conditionLabels[item.condition] ||
                                                    item.condition ||
                                                    "Used"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            {hasMore && filteredItems.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mp-load-more"
                >
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleLoadMore}
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
                <p className="meta-mono mp-count">
                    Showing {filteredItems.length} of {total} items
                </p>
            )}
        </div>
    );
}
