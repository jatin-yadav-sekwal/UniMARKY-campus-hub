import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Search, Eye, Plus, ChevronDown, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    "new": "NEW",
    "like-new": "LIKE NEW",
    "great": "GREAT CONDITION",
    "good": "GOOD CONDITION",
    "fair": "FAIR CONDITION",
    "": "USED",
};

export function MarketplacePage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchItems = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
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
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeCategory]);

    useEffect(() => {
        setOffset(0);
        fetchItems(true);
    }, [activeCategory]);

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
        <div className="relative min-h-screen pb-20">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">CAMPUS </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">DEALS</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Exclusive marketplace for verified university students. Buy, sell, and swap with your campus peers safely.
                </motion.p>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 mb-6 sm:mb-8"
            >
                {/* Category Pills - horizontal scroll on mobile */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                    <div className="flex items-center gap-2 min-w-max sm:flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeCategory === cat.value
                                    ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search textbooks, tech..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-full border-border/50 bg-muted/30 text-sm"
                    />
                </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
            ) : (
                <>
                    {/* Items Grid */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/marketplace/${item.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Tag className="w-12 h-12 text-muted-foreground/30" />
                                                    </div>
                                                )}

                                                {/* Badge */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${item.isNegotiable
                                                    ? "bg-brand-orange text-white"
                                                    : "bg-brand-navy text-white"
                                                    }`}>
                                                    {item.isNegotiable ? "NEGOTIABLE" : "FIXED PRICE"}
                                                </div>

                                                {/* Quick View */}
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Eye className="w-4 h-4 text-brand-navy" />
                                                </motion.button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-foreground truncate group-hover:text-brand-navy transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                                                    {item.category?.replace("-", " ")} • {conditionLabels[item.condition] || item.condition || "USED"}
                                                </p>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Expected Price</p>
                                                        <p className="text-xl font-black text-brand-navy">₹{parseFloat(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <Tag className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery ? "Try a different search term" : "Be the first to list an item!"}
                            </p>
                            <Button onClick={() => navigate("/marketplace/list")} className="rounded-full">
                                List Your First Item
                            </Button>
                        </motion.div>
                    )}

                    {/* Load More Button */}
                    {hasMore && filteredItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all gap-2"
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
                        </motion.div>
                    )}

                    {/* Results Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredItems.length} of {total} items
                        </p>
                    )}
                </>
            )}

            {/* Floating Add Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                onClick={() => navigate("/marketplace/list")}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-white shadow-2xl shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
                <Plus className="w-8 h-8" strokeWidth={2.5} />
            </motion.button>
        </div>
    );
}
