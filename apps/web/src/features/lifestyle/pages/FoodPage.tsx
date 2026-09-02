import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, Clock, ChevronDown, Search, Utensils, Phone } from 'lucide-react';
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

const cuisines = [
    { value: "all", label: "All Cuisines" },
    { value: "north-indian", label: "North Indian" },
    { value: "south-indian", label: "South Indian" },
    { value: "chinese", label: "Chinese" },
    { value: "fast-food", label: "Fast Food" },
    { value: "cafe", label: "Cafes" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Beverages" },
];

export function FoodPage() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const offsetRef = useRef(0);
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 12;

    const fetchRestaurants = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offsetRef.current;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response: FoodResponse = await api.get(
                `/restaurants?limit=${LIMIT}&offset=${currentOffset}&cuisine=${activeCuisine}`
            );

            if (reset) {
                setRestaurants(response.items);
            } else {
                setRestaurants(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            offsetRef.current = currentOffset + response.items.length;
        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCuisine]);

    useEffect(() => {
        offsetRef.current = 0;
        fetchRestaurants(true);
    }, [fetchRestaurants]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
    };

    const handleLoadMore = () => {
        fetchRestaurants(false);
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <m.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3"
                    >
                        <span className="text-orange-500">CAMPUS </span>
                        <span className="text-foreground">EATS</span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                    >
                        Discover the best food spots around campus. From quick chai breaks to late night cravings.
                    </m.p>
                </div>
            </div>

            {/* Filters */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 mb-6 sm:mb-8"
            >
                {/* Cuisine Pills - horizontal scroll on mobile */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                    <div className="flex items-center gap-2 min-w-max sm:flex-wrap">
                        {cuisines.map((cuisine) => (
                            <button
                                key={cuisine.value}
                                onClick={() => handleCuisineChange(cuisine.value)}
                                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${activeCuisine === cuisine.value
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {cuisine.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, cuisine..."
                        aria-label="Search restaurants"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-full border-border/50 bg-muted/30 text-sm"
                    />
                </div>
            </m.div>

            {/* Content Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </m.div>
                ) : filteredRestaurants.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16 sm:py-20"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                            <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No restaurants found</h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto px-4">
                            {searchQuery || activeCuisine !== "all"
                                ? "Try adjusting your filters or search query."
                                : "No restaurants have been added yet. Check back soon!"}
                        </p>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredRestaurants.map((restaurant, index) => (
                            <m.div
                                key={restaurant.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Link to={`/food/${restaurant.id}`} className="group block">
                                    <div className="relative overflow-hidden rounded-2xl bg-background border border-border/50 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-[border-color,box-shadow] duration-300">
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
                                                {restaurant.cuisine && (
                                                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 capitalize">
                                                        {restaurant.cuisine}
                                                    </span>
                                                )}
                                            </div>

                                            {restaurant.address && (
                                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="line-clamp-1">{restaurant.address}</span>
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                                {restaurant.timing && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {restaurant.timing}
                                                    </span>
                                                )}
                                                {restaurant.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {restaurant.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && filteredRestaurants.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                >
                    <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors gap-2"
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
                </m.div>
            )}

            {/* Count */}
            {!loading && total > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Showing {filteredRestaurants.length} of {total} places
                </p>
            )}
        </div>
    );
}
