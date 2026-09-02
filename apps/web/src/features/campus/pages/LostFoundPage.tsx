import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Eye, Plus, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    { value: "all", label: "All Items" },
    { value: "lost", label: "Lost Items" },
    { value: "found", label: "Found Items" },
];

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });
};

export function LostFoundPage() {
    const navigate = useNavigate();
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

    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const handleLoadMore = () => {
        fetchItems(false);
    };


    return (
        <div className="relative min-h-screen pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <m.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                    >
                        <span className="text-brand-navy">LOST & </span>
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">FOUND</span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                    >
                        Help your campus community by reporting lost items or returning found ones.
                    </m.p>
                </div>

                <m.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        onClick={() => navigate("/lost-found/my-listings")}
                        variant="outline"
                        className="rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors font-bold"
                    >
                        My Listings
                    </Button>
                </m.div>
            </div>

            {/* Type Filter Pills & Search */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8 justify-between"
            >
                <div className="flex flex-wrap items-center gap-2">
                    {typeFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleTypeChange(filter.value)}
                            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 ${activeType === filter.value
                                ? filter.value === "lost"
                                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                    : filter.value === "found"
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                        : "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search lost items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-full border-border/50 bg-muted/30 text-sm focus-visible:ring-teal-500"
                    />
                </div>
            </m.div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                    </m.div>
                ) : items.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                            <Search className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No items reported</h3>
                        <p className="text-muted-foreground mb-6">
                            That's good news! Nothing lost or found yet.
                        </p>
                        <Button onClick={() => navigate("/lost-found/report")} className="rounded-full">
                            Report an Item
                        </Button>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {items.map((item, index) => (
                            <m.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Link to={`/lost-found/${item.id}`} className="group block">
                                    <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-border hover:shadow-xl transition-shadow duration-300">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.itemName}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {item.type === "lost" ? (
                                                        <Search className="w-12 h-12 text-muted-foreground/30" />
                                                    ) : (
                                                        <MapPin className="w-12 h-12 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    item.type === "lost"
                                                        ? "bg-red-500/90 text-white"
                                                        : "bg-teal-500/90 text-white"
                                                }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.status === "open"
                                                        ? "bg-amber-500/90 text-white"
                                                        : "bg-emerald-500/90 text-white"
                                                }`}>
                                                    {item.status === "open" ? "Active" : "Resolved"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-teal-600 transition-colors line-clamp-1">
                                                {item.itemName}
                                            </h3>
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="w-3 h-3 shrink-0" />
                                                <span className="line-clamp-1">{item.location}</span>
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                                <p className="text-xs text-muted-foreground">
                                                    by <span className="font-medium text-foreground">{item.reporterName}</span>
                                                </p>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && items.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                >
                    <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-colors gap-2"
                    >
                        {loadingMore ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                View More Items
                                <ChevronDown className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </m.div>
            )}

            {/* Results Count */}
            {!loading && total > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Showing {items.length} of {total} items
                </p>
            )}

            {/* Floating Add Button */}
            <m.button
                initial={{ scale: 0.001 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                onClick={() => navigate("/lost-found/report")}
                aria-label="Report lost or found item"
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
            >
                <Plus className="w-8 h-8" strokeWidth={2.5} />
            </m.button>
        </div>
    );
}
