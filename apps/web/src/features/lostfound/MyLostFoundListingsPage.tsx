import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Loader2, ArrowUp, Search, Trash2, Edit, Plus, MapPin, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";

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
    total: number;
}

/* ── Lost & Found Listing Card ── */
function LostFoundListingCard({ item, onDelete }: { item: LostFoundItem; onDelete: () => void }) {
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-md hover:border-teal-200/60 dark:hover:border-teal-500/20 transition-all"
        >
            {item.imageUrl && (
                <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold ${item.type === "lost"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                        }`}>
                        {item.type.toUpperCase()}
                    </div>
                    {item.status && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold ${item.status === "resolved"
                            ? "bg-gray-500 text-white"
                            : "bg-teal-500 text-white"
                            }`}>
                            {item.status.toUpperCase()}
                        </div>
                    )}
                </div>
            )}
            <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type === "lost"
                        ? "text-red-600 bg-red-100/60 dark:bg-red-900/30"
                        : "text-green-600 bg-green-100/60 dark:bg-green-900/30"
                        }`}>
                        {item.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {formatDate(item.createdAt)}
                    </span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.itemName}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                {item.location && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                    </p>
                )}
                <div className="flex gap-2 pt-2 mt-2 border-t border-teal-100/30 dark:border-white/5">
                    <Link
                        to={`/lost-found/${item.id}`}
                        className="flex-1 text-center text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center justify-center gap-1 transition-colors"
                    >
                        <Search className="w-3 h-3" /> View
                    </Link>
                    <Link
                        to={`/lost-found/${item.id}`}
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

export function MyLostFoundListingsPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<LostFoundItem[]>([]);
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
            const res: LostFoundResponse = await api.get(`/lostfound/my-listings?limit=${LIMIT}&offset=${off}`);
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
            await api.delete(`/lostfound/${itemId}`);
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete listing. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-background to-background dark:from-teal-950/10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Lost & Found Listings</h2>
                        <p className="text-sm text-muted-foreground">Manage and monitor your reported items</p>
                    </div>
                    <Button
                        onClick={() => navigate("/lost-found/report")}
                        className="rounded-full gap-1.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-5 shadow-lg shadow-teal-500/30 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Report New Item
                    </Button>
                </div>

                {/* Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-teal-500 font-medium">
                        Showing: <span className="bg-teal-100/60 dark:bg-teal-900/20 px-2 py-0.5 rounded-full">{items.length} Items</span>
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-40 bg-teal-100/30 dark:bg-teal-900/10" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-teal-100/40 dark:bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-teal-100/30 dark:bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-100/50 dark:bg-teal-900/20 flex items-center justify-center">
                            <Search className="w-8 h-8 text-teal-300 dark:text-teal-700" />
                        </div>
                        <h3 className="font-semibold text-foreground/70 mb-1">No listings yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start reporting items to see them here</p>
                        <Button
                            onClick={() => navigate("/lost-found/report")}
                            className="rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 shadow-lg shadow-teal-500/25"
                        >
                            Report Your First Item
                        </Button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {items.map(item => (
                                <LostFoundListingCard key={item.id} item={item} onDelete={() => handleDeleteItem(item.id)} />
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
                            className="rounded-full gap-2 px-8 border-teal-200 dark:border-teal-800/30 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-semibold"
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
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-teal-500/40 transition-all"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
