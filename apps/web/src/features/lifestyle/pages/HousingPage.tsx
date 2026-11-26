import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api';
import { Loader2, Star, MapPin, ChevronDown, Search, Home, Building2, Hotel } from 'lucide-react';
import './lifestyle.css';

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
    { value: "all", label: "All types", icon: Home },
    { value: "PG", label: "PGs", icon: Hotel },
    { value: "Hostel", label: "Hostels", icon: Building2 },
    { value: "Apartment", label: "Flats / apartments", icon: Home },
];

const typeColors: Record<string, string> = {
    PG: "#5751a7",
    Hostel: "#2f6bd8",
    Apartment: "#1f8a63",
};

export function HousingPage() {
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
        <div className="um-editorial um-housing">
            <header className="page-head">
                <div>
                    <p className="section-label">
                        <span>01</span>/ Housing
                    </p>
                    <h1 className="page-title">
                        Campus <span>stays.</span>
                    </h1>
                    <p className="page-lead">
                        Verified student accommodations, PGs and apartments near campus, with
                        genuine reviews.
                    </p>
                </div>
            </header>

            <div className="hs-types" role="group" aria-label="Filter by accommodation type">
                {types.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => handleTypeChange(type.value)}
                            aria-pressed={activeType === type.value}
                            className={`hs-type${activeType === type.value ? ' active' : ''}`}
                        >
                            <Icon size={14} />
                            {type.label}
                        </button>
                    );
                })}
            </div>

            <div className="hs-toolbar">
                <div className="hs-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, location..."
                        aria-label="Search accommodations"
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
                        className="hs-loading"
                    >
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading stays...</span>
                    </m.div>
                ) : filteredAccommodations.length === 0 ? (
                    <m.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="empty-state"
                    >
                        <span className="empty-icon">
                            <Home size={24} strokeWidth={1.5} />
                        </span>
                        <h3>No accommodations found</h3>
                        <p>
                            {searchQuery
                                ? "Try a different search term."
                                : "No listings available in this category yet."}
                        </p>
                    </m.div>
                ) : (
                    <m.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hs-grid"
                    >
                        {filteredAccommodations.map((accommodation, index) => {
                            let images: string[] = [];
                            try {
                                images = accommodation.images ? JSON.parse(accommodation.images) : [];
                            } catch {
                                images = [];
                            }
                            const firstImage = images[0] || null;
                            const accent = typeColors[accommodation.type] || "#6b6760";

                            return (
                                <m.div
                                    key={accommodation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.04 }}
                                    layout
                                >
                                    <Link to={`/housing/${accommodation.id}`} className="hs-card">
                                        <div className="hs-media">
                                            {firstImage ? (
                                                <img src={firstImage} alt={accommodation.name} />
                                            ) : (
                                                <span className="hs-media-empty">
                                                    <Home size={30} strokeWidth={1.4} />
                                                </span>
                                            )}
                                            <span className="hs-badge" style={{ background: accent }}>
                                                {accommodation.type}
                                            </span>
                                            <span className="hs-rating">
                                                <Star size={12} fill="currentColor" />
                                                {parseFloat(accommodation.rating).toFixed(1)}
                                            </span>
                                        </div>

                                        <div className="hs-body">
                                            <h3 className="hs-name">{accommodation.name}</h3>
                                            <p className="hs-loc">
                                                <MapPin size={12} />
                                                {accommodation.location}
                                            </p>

                                            <div className="hs-foot">
                                                <div>
                                                    <span className="hs-from">Starting from</span>
                                                    <p className="hs-rent">
                                                        {accommodation.rentRange ||
                                                            (accommodation.minPrice
                                                                ? `₹${accommodation.minPrice}`
                                                                : "Contact")}
                                                    </p>
                                                </div>
                                                <span className="hs-link">View details →</span>
                                            </div>
                                        </div>
                                    </Link>
                                </m.div>
                            );
                        })}
                    </m.div>
                )}
            </AnimatePresence>

            {hasMore && filteredAccommodations.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hs-load-more"
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
                                View more places
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </m.div>
            )}

            {!loading && total > 0 && (
                <p className="meta-mono hs-count">
                    Showing {filteredAccommodations.length} of {total} places
                </p>
            )}
        </div>
    );
}