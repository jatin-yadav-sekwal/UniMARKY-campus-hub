import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Phone, Wifi, Wind, Dumbbell, Car, Shield, Zap, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    "PG": "from-blue-500 to-blue-600",
    "Hostel": "from-purple-500 to-purple-600",
    "Apartment": "from-green-500 to-green-600",
};

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !accommodation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Accommodation not found"}</p>
                <Button onClick={() => navigate("/housing")} variant="outline">
                    Back to Housing
                </Button>
            </div>
        );
    }

    const images = Array.isArray(accommodation.images) ? accommodation.images : [];
    const amenities = accommodation.amenities?.split(",").map(a => a.trim()) || [];

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
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/housing")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Housing
            </motion.button>

            {/* Image Gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-8"
            >
                <div className="aspect-[21/10] relative bg-muted">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={`${accommodation.name} - Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🏠</span>
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${index === currentImageIndex ? "border-purple-500 ring-2 ring-purple-500/20" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${typeColors[accommodation.type]}`}>
                        {accommodation.type}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{parseFloat(accommodation.rating).toFixed(1)}</span>
                        <span className="text-muted-foreground">({accommodation.reviewCount} reviews)</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3">
                    {accommodation.name}
                </h1>

                <p className="flex items-center gap-2 text-muted-foreground text-lg">
                    <MapPin className="w-5 h-5" />
                    {accommodation.address || accommodation.location}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-muted/30 border border-border/50"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">About</h3>
                        <p className="text-foreground leading-relaxed text-lg">
                            {accommodation.description || "No description available."}
                        </p>
                    </motion.div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-2xl bg-muted/30 border border-border/50"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map((amenity, index) => {
                                    const Icon = amenityIcons[amenity] || Shield;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50"
                                        >
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                                                <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <span className="font-medium text-foreground">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar - Contact & Pricing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    {/* Pricing Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Pricing</h3>

                        {accommodation.rentRange ? (
                            <p className="text-3xl font-black text-foreground mb-2">
                                {accommodation.rentRange}
                            </p>
                        ) : (
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Starting from</p>
                                <p className="text-3xl font-black text-purple-600">
                                    ₹{accommodation.minPrice ? parseFloat(accommodation.minPrice).toLocaleString() : "N/A"}
                                    <span className="text-base font-normal text-muted-foreground">/month</span>
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-muted-foreground">
                            * Prices may vary based on room type and sharing
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Contact</h3>

                        {accommodation.phone ? (
                            <a
                                href={`tel:${accommodation.phone}`}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                                <Phone className="w-5 h-5" />
                                {accommodation.phone}
                            </a>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                Contact info not available
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
