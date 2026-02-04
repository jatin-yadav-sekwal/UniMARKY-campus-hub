import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, ChevronDown, Search, Home, Building2, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Accommodation {
    id: string;
    name: string;
    type: "PG" | "Hostel" | "Apartment";
    description: string;
    address: string;
    phone: string;
    amenities: string;
    images: string;
    minPrice: string;
    maxPrice: string;
    rentRange: string;
    rating: string;
    reviewCount: number;
    location: string;
}

interface AccommodationResponse {
    items: Accommodation[];
    hasMore: boolean;
    total: number;
}

const typeFilters = [
    { value: "all", label: "All Types", icon: Home },
    { value: "PG", label: "PG", icon: Building2 },
    { value: "Hostel", label: "Hostel", icon: Hotel },
    { value: "Apartment", label: "Apartment", icon: Home },
];

const typeColors: Record<string, string> = {
    "PG": "bg-blue-500",
    "Hostel": "bg-purple-500",
    "Apartment": "bg-green-500",
};

export function HousingPage() {
    const navigate = useNavigate();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeType, setActiveType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchAccommodations = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const typeParam = activeType !== "all" ? `&type=${activeType}` : "";
            const response: AccommodationResponse = await api.get(
                `/accommodation?limit=${LIMIT}&offset=${currentOffset}${typeParam}`
            );

            if (reset) {
                setAccommodations(response.items);
            } else {
                setAccommodations(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch accommodations:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeType]);

    useEffect(() => {
        setOffset(0);
        fetchAccommodations(true);
    }, [activeType]);

    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const handleLoadMore = () => {
        fetchAccommodations(false);
    };

    // Filter by search
    const filteredAccommodations = accommodations.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFirstImage = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        } catch {
            return null;
        }
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">FIND YOUR </span>
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">HOME</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Discover PGs, hostels, and apartments near your campus.
                </motion.p>
            </div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-8"
            >
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search accommodations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-full border-border/50 text-sm sm:text-base"
                    />
                </div>

                {/* Type Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {typeFilters.map((filter) => {
                        const Icon = filter.icon;
                        return (
                            <button
                                key={filter.value}
                                onClick={() => handleTypeChange(filter.value)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeType === filter.value
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <>
                    {/* Accommodation Grid */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredAccommodations.map((accommodation, index) => {
                                const firstImage = getFirstImage(accommodation.images);
                                return (
                                    <motion.div
                                        key={accommodation.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        layout
                                    >
                                        <Link to={`/housing/${accommodation.id}`} className="group block">
                                            <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                                                {/* Image */}
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage}
                                                            alt={accommodation.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                                            <Home className="w-12 h-12 text-muted-foreground/30" />
                                                        </div>
                                                    )}

                                                    {/* Type Badge */}
                                                    <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-bold ${typeColors[accommodation.type]}`}>
                                                        {accommodation.type}
                                                    </div>

                                                    {/* Rating Badge */}
                                                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-bold text-sm">{parseFloat(accommodation.rating).toFixed(1)}</span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-purple-500 transition-colors line-clamp-1 mb-1">
                                                        {accommodation.name}
                                                    </h3>

                                                    <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                                        <MapPin className="w-3 h-3" />
                                                        {accommodation.location}
                                                    </p>

                                                    {/* Price */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Starting from</p>
                                                            <p className="text-xl font-black text-purple-600">
                                                                ₹{accommodation.minPrice ? parseFloat(accommodation.minPrice).toLocaleString() : "N/A"}
                                                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {accommodation.reviewCount} reviews
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredAccommodations.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 sm:py-20"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <Home className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500/50" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No accommodations found</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                                {searchQuery || activeType !== "all"
                                    ? "Try adjusting your filters or search query."
                                    : "No accommodations have been added yet. Check back soon!"}
                            </p>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && filteredAccommodations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredAccommodations.length} of {total} accommodations
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
