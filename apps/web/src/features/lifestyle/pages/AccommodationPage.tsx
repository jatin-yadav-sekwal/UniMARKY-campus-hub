import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Phone, Wifi, Wind, Dumbbell, Car, Shield, Zap, ChevronLeft, ChevronRight, Loader2, Home } from 'lucide-react';
import './lifestyle.css';

interface AccommodationDetail {
    id: string;
    name: string;
    type: "PG" | "Hostel" | "Apartment";
    description: string;
    address: string;
    phone: string;
    amenities: string;
    images: string[];
    minPrice: string;
    maxPrice: string;
    rentRange: string;
    rating: string;
    reviewCount: number;
    location: string;
}

const amenityIcons: Record<string, React.ElementType> = {
    "WiFi": Wifi,
    "AC": Wind,
    "Gym": Dumbbell,
    "Parking": Car,
    "Security": Shield,
    "Power Backup": Zap,
};

const typeColors: Record<string, string> = {
    "PG": "#5751a7",
    "Hostel": "#2f6bd8",
    "Apartment": "#1f8a63",
};

interface GalleryProps {
    images: string[];
    name: string;
    currentImageIndex: number;
    onPrev: () => void;
    onNext: () => void;
    onSelectIndex: (index: number) => void;
}

function AccommodationImageGallery({
    images,
    name,
    currentImageIndex,
    onPrev,
    onNext,
    onSelectIndex,
}: GalleryProps) {
    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hsd-gallery"
        >
            <div className="hsd-main">
                {images.length > 0 ? (
                    <>
                        <img
                            src={images[currentImageIndex]}
                            alt={`${name} view ${currentImageIndex + 1}`}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={onPrev}
                                    aria-label="Previous photo"
                                    className="hsd-nav prev"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={onNext}
                                    aria-label="Next photo"
                                    className="hsd-nav next"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        <span className="hsd-counter">
                            {currentImageIndex + 1} / {images.length}
                        </span>
                    </>
                ) : (
                    <span className="hsd-main-empty">
                        <Home size={56} strokeWidth={1.2} />
                    </span>
                )}
            </div>

            {images.length > 1 && (
                <div className="hsd-thumbs">
                    {images.map((img, index) => (
                        <button
                            key={img}
                            type="button"
                            onClick={() => onSelectIndex(index)}
                            aria-label={`Select photo ${index + 1}`}
                            className={`hsd-thumb${index === currentImageIndex ? ' active' : ''}`}
                        >
                            <img src={img} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </m.div>
    );
}

function AccommodationAmenitiesSection({ amenities }: { amenities: string[] }) {
    if (amenities.length === 0) return null;
    return (
        <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hsd-panel"
        >
            <h3 className="hsd-label">Amenities</h3>
            <div className="hsd-amenities">
                {amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Shield;
                    return (
                        <div key={amenity} className="hsd-amenity">
                            <Icon size={17} strokeWidth={1.6} />
                            <span>{amenity}</span>
                        </div>
                    );
                })}
            </div>
        </m.div>
    );
}

function AccommodationSidebar({ rentRange, minPrice, phone }: { rentRange: string | null; minPrice: string | null; phone: string | null }) {
    return (
        <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hsd-col"
        >
            <div className="hsd-price">
                <h3 className="hsd-label">Pricing</h3>
                {rentRange ? (
                    <p className="hsd-price-value">{rentRange}</p>
                ) : (
                    <p className="hsd-price-value">
                        ₹{minPrice ? parseFloat(minPrice).toLocaleString() : "N/A"}
                        <small> /month</small>
                    </p>
                )}
                <p className="hsd-price-note">
                    * Prices may vary based on room type and sharing
                </p>
            </div>

            <div className="hsd-contact">
                <h3 className="hsd-label">Contact</h3>
                {phone ? (
                    <a href={`tel:${phone}`} className="button button-primary button-block">
                        <Phone size={16} />
                        {phone}
                    </a>
                ) : (
                    <p className="hsd-price-note">Contact info not available</p>
                )}
            </div>
        </m.div>
    );
}

export function AccommodationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [accommodation, setAccommodation] = useState<AccommodationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        api.get(`/accommodation/${id}`)
            .then(setAccommodation)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="um-editorial um-stay">
                <div className="hs-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading stay...</span>
                </div>
            </div>
        );
    }

    if (error || !accommodation) {
        return (
            <div className="um-editorial um-stay">
                <div className="empty-state">
                    <span className="empty-icon">
                        <Home size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{error || "Accommodation not found"}</h3>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate("/housing")}
                    >
                        Back to housing
                    </button>
                </div>
            </div>
        );
    }

    const images = Array.isArray(accommodation.images) ? accommodation.images : [];
    const amenities = accommodation.amenities?.split(",").map(a => a.trim()) || [];
    const accent = typeColors[accommodation.type] || "#6b6760";

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="um-editorial um-stay">
            <button
                type="button"
                onClick={() => navigate("/housing")}
                className="back-link"
            >
                <ArrowLeft size={15} />
                Back to Housing
            </button>

            <AccommodationImageGallery
                images={images}
                name={accommodation.name}
                currentImageIndex={currentImageIndex}
                onPrev={prevImage}
                onNext={nextImage}
                onSelectIndex={setCurrentImageIndex}
            />

            <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="hsd-tags">
                    <span className="hsd-type" style={{ background: accent }}>
                        {accommodation.type}
                    </span>
                    <span className="hsd-rating">
                        <Star size={15} fill="currentColor" />
                        {parseFloat(accommodation.rating).toFixed(1)}
                        <span>({accommodation.reviewCount} reviews)</span>
                    </span>
                </div>

                <h1 className="hsd-title">{accommodation.name}</h1>

                <p className="hsd-address">
                    <MapPin size={15} />
                    {accommodation.address || accommodation.location}
                </p>
            </m.div>

            <div className="hsd-grid">
                <div className="hsd-col">
                    {accommodation.description && (
                        <m.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="hsd-panel"
                        >
                            <h3 className="hsd-label">About</h3>
                            <p>{accommodation.description}</p>
                        </m.div>
                    )}

                    <AccommodationAmenitiesSection amenities={amenities} />
                </div>

                <AccommodationSidebar
                    rentRange={accommodation.rentRange}
                    minPrice={accommodation.minPrice}
                    phone={accommodation.phone}
                />
            </div>
        </div>
    );
}