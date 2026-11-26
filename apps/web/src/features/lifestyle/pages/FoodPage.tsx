import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, Clock, ChevronDown, Search, Utensils, Phone } from 'lucide-react';
import './lifestyle.css';

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
    { value: "all", label: "All cuisines" },
    { value: "north-indian", label: "North Indian" },
    { value: "south-indian", label: "South Indian" },
    { value: "chinese", label: "Chinese" },
    { value: "fast-food", label: "Fast Food" },
    { value: "cafe", label: "Cafes" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Beverages" },
];

export function FoodPage() {
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
                `/food?limit=${LIMIT}&offset=${currentOffset}&cuisine=${activeCuisine}`
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

    const handleLoadMore = () => {
        fetchRestaurants(false);
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="um-editorial um-food">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Eats
                    </p>
                    <h1 className="page-title">
                        Campus <span>eats.</span>
                    </h1>
                    <p className="page-lead">
                        Discover the best food spots around campus — from quick chai breaks to
                        late-night cravings.
                    </p>
                </div>
            </header>

            <div className="fd-cuisines" role="group" aria-label="Filter by cuisine">
                {cuisines.map((cuisine) => (
                    <button
                        key={cuisine.value}
                        type="button"
                        onClick={() => setActiveCuisine(cuisine.value)}
                        aria-pressed={activeCuisine === cuisine.value}
                        className={`fd-cuisine${activeCuisine === cuisine.value ? ' active' : ''}`}
                    >
                        {cuisine.label}
                    </button>
                ))}
            </div>

            <div className="fd-toolbar">
                <div className="fd-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, cuisine..."
                        aria-label="Search restaurants"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="field-input"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fd-loading"
                    >
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading spots...</span>
                    </m.div>
                ) : filteredRestaurants.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <Utensils size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No restaurants found</h3>
                        <p>
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
                        className="fd-grid"
                    >
                        {filteredRestaurants.map((restaurant, index) => (
                            <m.div
                                key={restaurant.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.04 }}
                                layout
                            >
                                <Link to={`/food/${restaurant.id}`} className="fd-card">
                                    <div className="fd-media">
                                        {restaurant.imageUrl ? (
                                            <img src={restaurant.imageUrl} alt={restaurant.name} />
                                        ) : (
                                            <span className="fd-media-empty">
                                                <Utensils size={30} strokeWidth={1.4} />
                                            </span>
                                        )}

                                        <span className="fd-rating">
                                            <Star size={12} fill="currentColor" />
                                            {(parseFloat(restaurant.rating) || 0).toFixed(1)}
                                        </span>

                                        {restaurant.priceRange && (
                                            <span className="fd-price">{restaurant.priceRange}</span>
                                        )}
                                    </div>

                                    <div className="fd-body">
                                        <h3 className="fd-name">{restaurant.name}</h3>

                                        {restaurant.cuisine && (
                                            <span className="fd-cuisine-tag">
                                                {restaurant.cuisine}
                                            </span>
                                        )}

                                        {restaurant.address && (
                                            <p className="fd-addr">
                                                <MapPin size={12} />
                                                <span>{restaurant.address}</span>
                                            </p>
                                        )}

                                        <div className="fd-foot">
                                            {restaurant.timing && (
                                                <span className="fd-meta">
                                                    <Clock size={12} />
                                                    {restaurant.timing}
                                                </span>
                                            )}
                                            {restaurant.phone && (
                                                <span className="fd-meta">
                                                    <Phone size={12} />
                                                    {restaurant.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>

            {hasMore && filteredRestaurants.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fd-load-more"
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
                                View more spots
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </m.div>
            )}

            {!loading && total > 0 && (
                <p className="meta-mono fd-count">
                    Showing {filteredRestaurants.length} of {total} places
                </p>
            )}
        </div>
    );
}
