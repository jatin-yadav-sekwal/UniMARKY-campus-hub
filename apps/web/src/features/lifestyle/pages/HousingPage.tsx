import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
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

const types = [
    { value: "all", label: "All Types", icon: Home },
    { value: "PG", label: "PGs", icon: Hotel },
    { value: "Hostel", label: "Hostels", icon: Building2 },
    { value: "Apartment", label: "Flats/Apartments", icon: Home },
];

const typeColors: Record<string, string> = {
    PG: "bg-purple-500",
    Hostel: "bg-blue-500",
    Apartment: "bg-emerald-500",
};

export function HousingPage() {
    const navigate = useNavigate();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const offsetRef = useRef(0);
    const [activeType, setActiveType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const LIMIT = 12;

    const fetchAccommodations = useCallback(async (reset = false) => {
        const currentOffset = reset ? 0 : offsetRef.current;
        if (reset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response: AccommodationResponse = await api.get(
                `/accommodations?limit=${LIMIT}&offset=${currentOffset}&type=${activeType}`
            );

            if (reset) {
                setAccommodations(response.items);
            } else {
                setAccommodations(prev => [...prev, ...response.items]);
            }
            setHasMore(response.hasMore);
            setTotal(response.total);
            offsetRef.current = currentOffset + response.items.length;
        } catch (error) {
            console.error("Failed to fetch accommodations:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeType]);

    useEffect(() => {
        offsetRef.current = 0;
        fetchAccommodations(true);
    }, [fetchAccommodations]);

    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const handleLoadMore = () => {
        fetchAccommodations(false);
    };

    const filteredAccommodations = accommodations.filter(acc =>
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <span className="text-purple-600">CAMPUS </span>
                        <span className="text-foreground">STAYS</span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xl"
                    >
                        Verified student accommodations, PGs, and apartments near campus with genuine reviews.
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
                {/* Type Pills - horizontal scroll on mobile */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                    <div className="flex items-center gap-2 min-w-max sm:flex-wrap">
                        {types.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => handleTypeChange(type.value)}
                                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${activeType === type.value
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, location..."
                        aria-label="Search accommodations"
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
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </m.div>
                ) : filteredAccommodations.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                            <Home className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No accommodations found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery ? "Try a different search term" : "No listings available in this category yet."}
                        </p>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredAccommodations.map((accommodation, index) => {
                            const images = accommodation.images ? JSON.parse(accommodation.images) : [];
                            const firstImage = images[0] || null;

                            return (
                                <m.div
                                    key={accommodation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                >
                                    <Link to={`/lifestyle/housing/${accommodation.id}`} className="group block">
                                        <div className="overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-purple-500/50 hover:shadow-xl transition-shadow duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                                {firstImage ? (
                                                    <img
                                                        src={firstImage}
                                                        alt={accommodation.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
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

                                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Starting from</span>
                                                        <p className="text-base font-bold text-foreground">
                                                            {accommodation.rentRange || (accommodation.minPrice ? `₹${accommodation.minPrice}` : "Contact")}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:underline">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </m.div>
                            );
                        })}
                    </m.div>
                )}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && filteredAccommodations.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                >
                    <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="px-8 py-6 rounded-full font-bold text-lg border-2 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors gap-2"
                    >
                        {loadingMore ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                View More Places
                                <ChevronDown className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </m.div>
            )}

            {/* Results Count */}
            {!loading && total > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Showing {filteredAccommodations.length} of {total} places
                </p>
            )}
        </div>
    );
}
