import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, Clock, ChevronDown, Search, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Restaurant {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    tags: string;
    address: string;
    phone: string;
    timing: string;
    priceRange: string;
    rating: string;
    reviewCount: number;
    imageUrl: string;
    location: string;
}

interface FoodResponse {
    items: Restaurant[];
    hasMore: boolean;
    total: number;
}

const cuisineFilters = [
    { value: "all", label: "All Cuisines" },
    { value: "North Indian", label: "North Indian" },
    { value: "Italian", label: "Italian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Healthy", label: "Healthy" },
    { value: "Cafe", label: "Cafe" },
];

export function FoodPage() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 20;

    const fetchRestaurants = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const cuisineParam = activeCuisine !== "all" ? `&cuisine=${activeCuisine}` : "";
            const response: FoodResponse = await api.get(
                `/food?limit=${LIMIT}&offset=${currentOffset}${cuisineParam}`
            );

            if (reset) {
                setRestaurants(response.items);
            } else {
                setRestaurants(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            setOffset(currentOffset + response.items.length);
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [offset, activeCuisine]);

    useEffect(() => {
        setOffset(0);
        fetchRestaurants(true);
    }, [activeCuisine]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
    };

    const handleLoadMore = () => {
        fetchRestaurants(false);
    };

    // Filter by search
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                >
                    <span className="text-brand-navy">FOOD </span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">ZONE</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                >
                    Discover the best restaurants and eateries near your campus.
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
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-full border-border/50 text-sm sm:text-base"
                    />
                </div>

                {/* Cuisine Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {cuisineFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleCuisineChange(filter.value)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCuisine === filter.value
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            ) : (
                <>
                    {/* Restaurant Grid */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredRestaurants.map((restaurant, index) => (
                                <motion.div
                                    key={restaurant.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/food/${restaurant.id}`} className="group block">
                                        <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                {restaurant.imageUrl ? (
                                                    <img
                                                        src={restaurant.imageUrl}
                                                        alt={restaurant.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <Utensils className="w-12 h-12 text-muted-foreground/30" />
                                                    </div>
                                                )}

                                                {/* Rating Badge */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-sm">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                                </div>

                                                {/* Price Range */}
                                                {restaurant.priceRange && (
                                                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
                                                        {restaurant.priceRange}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-orange-500 transition-colors line-clamp-1">
                                                        {restaurant.name}
                                                    </h3>
                                                </div>

                                                <p className="text-sm text-orange-600 font-medium mb-2">
                                                    {restaurant.cuisine}
                                                </p>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {restaurant.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {restaurant.location}
                                                    </span>
                                                    {restaurant.timing && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {restaurant.timing}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredRestaurants.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 sm:py-20"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500/50" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No restaurants found</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                                {searchQuery || activeCuisine !== "all"
                                    ? "Try adjusting your filters or search query."
                                    : "No restaurants have been added yet. Check back soon!"}
                            </p>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && filteredRestaurants.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-12"
                        >
                            <Button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                variant="outline"
                                className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all gap-2"
                            >
                                {loadingMore ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        View More Restaurants
                                        <ChevronDown className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Count */}
                    {!loading && total > 0 && (
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Showing {filteredRestaurants.length} of {total} restaurants
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
