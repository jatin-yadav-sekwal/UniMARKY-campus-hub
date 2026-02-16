import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, ShoppingBag, Trash2, Edit, Plus, Tag, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

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
    "new": "NEW",
    "like-new": "LIKE NEW",
    "great": "GREAT CONDITION",
    "good": "GOOD CONDITION",
    "fair": "FAIR CONDITION",
    "": "USED",
};

/* ── Marketplace Listing Card ── */
function MarketplaceListingCard({ item, onDelete }: { item: MarketplaceItem; onDelete: () => void }) {
    const navigate = useNavigate();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-md hover:border-orange-200/60 dark:hover:border-orange-500/20 transition-all"
        >
            {item.imageUrl && (
                <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold ${item.isNegotiable
                        ? "bg-brand-orange text-white"
                        : "bg-brand-navy text-white"
                        }`}>
                        {item.isNegotiable ? "NEGOTIABLE" : "FIXED"}
                    </div>
                </div>
            )}
            <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-orange-600 bg-orange-100/60 dark:bg-orange-900/30">
                        {item.category?.replace("-", " ") || "ITEM"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                        <p className="text-lg font-black text-brand-navy">₹{parseFloat(item.price).toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {conditionLabels[item.condition] || "USED"}
                    </span>
                </div>
                <div className="flex gap-2 pt-2 mt-2 border-t border-orange-100/30 dark:border-white/5">
                    <Link
                        to={`/marketplace/${item.id}`}
                        className="flex-1 text-center text-[11px] text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center justify-center gap-1 transition-colors"
                    >
                        <Tag className="w-3 h-3" /> View
                    </Link>
                    <Link
                        to={`/marketplace/edit/${item.id}`}
                        className="flex-1 text-center text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1 transition-colors"
                    >
                        <Edit className="w-3 h-3" /> Edit
                    </Link>
                    <button
                        onClick={onDelete}
                        className="flex-1 text-center text-[11px] text-red-400 hover:text-red-600 flex items-center justify-center gap-1 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" /> Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function MyMarketplaceListingsPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        if (reset) setLoading(true); else setLoadingMore(true);
        const off = reset ? 0 : offset;
        try {
            const res: MarketplaceResponse = await api.get(`/marketplace/my-listings?limit=${LIMIT}&offset=${off}`);
            if (reset) {
                setItems(res.items);
                setOffset(LIMIT);
            } else {
                setItems(prev => [...prev, ...res.items]);
                setOffset(prev => prev + LIMIT);
            }
            setHasMore(res.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset]);

    useEffect(() => {
        fetchItems(true);
    }, []);

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
        <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-background to-background dark:from-orange-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Marketplace Listings</h2>
                        <p className="text-sm text-muted-foreground">Manage and monitor your marketplace items</p>
                    </div>
                    <Button
                        onClick={() => navigate("/marketplace/list")}
                        className="rounded-full gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-5 shadow-lg shadow-orange-500/30 transition-all"
                    >
                        <Plus className="w-4 h-4" /> List New Item
                    </Button>
                </div>

                {/* Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-orange-500 font-medium">
                        Showing: <span className="bg-orange-100/60 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">{items.length} Items</span>
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-40 bg-orange-100/30 dark:bg-orange-900/10" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-orange-100/40 dark:bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-orange-100/30 dark:bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-orange-300 dark:text-orange-700" />
                        </div>
                        <h3 className="font-semibold text-foreground/70 mb-1">No listings yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start listing items to see them here</p>
                        <Button
                            onClick={() => navigate("/marketplace/list")}
                            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 shadow-lg shadow-orange-500/25"
                        >
                            List Your First Item
                        </Button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {items.map(item => (
                                <MarketplaceListingCard key={item.id} item={item} onDelete={() => handleDeleteItem(item.id)} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Load More */}
                {hasMore && !loading && items.length > 0 && (
                    <div className="flex justify-center py-8">
                        <Button
                            variant="outline"
                            onClick={() => fetchItems(false)}
                            disabled={loadingMore}
                            className="rounded-full gap-2 px-8 border-orange-200 dark:border-orange-800/30 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold"
                        >
                            {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                            Load More Items
                        </Button>
                    </div>
                )}
            </div>

            {/* Scroll to Top FAB */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-orange-500/40 transition-all"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
