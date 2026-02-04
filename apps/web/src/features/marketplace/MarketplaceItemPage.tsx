import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, BadgeCheck, Tag, Calendar, MapPin, MessageCircle, Share2, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerInfo {
    id: string;
    fullName: string;
    mobileNumber: string;
    department: string;
    isVerified: boolean;
}

interface MarketplaceItemDetail {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    condition: string;
    manufacturedYear: string;
    isNegotiable: boolean;
    imageUrl: string;
    createdAt: string;
    seller: SellerInfo;
}

const conditionLabels: Record<string, string> = {
    "new": "Brand New",
    "like-new": "Like New",
    "great": "Great Condition",
    "good": "Good Condition",
    "fair": "Fair Condition",
};

export function MarketplaceItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<MarketplaceItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/marketplace/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Item not found"}</p>
                <Button onClick={() => navigate("/marketplace")} variant="outline">
                    Back to Marketplace
                </Button>
            </div>
        );
    }

    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/marketplace")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-20 h-20 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${item.isNegotiable
                            ? "bg-brand-orange text-white"
                            : "bg-brand-navy text-white"
                        }`}>
                        {item.isNegotiable ? "NEGOTIABLE" : "FIXED PRICE"}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                            <Heart className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
                            <Share2 className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
                    {/* Category & Condition */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold uppercase tracking-wide">
                            {item.category?.replace("-", " ") || "General"}
                        </span>
                        {item.condition && (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                                {conditionLabels[item.condition] || item.condition}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                        {item.title}
                    </h1>

                    {/* Posted Date */}
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
                        <Calendar className="w-4 h-4" />
                        Listed on {formattedDate}
                    </p>

                    {/* Price */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-yellow/5 border border-brand-orange/20 mb-6">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Expected Price</p>
                        <p className="text-4xl font-black text-brand-navy">
                            ₹{parseFloat(item.price).toLocaleString()}
                        </p>
                        {item.isNegotiable && (
                            <p className="text-sm text-brand-orange mt-1 font-medium">
                                Open to negotiations
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Seller Info Card */}
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            Contact Seller
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-navy to-brand-navy/80 flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-lg text-foreground">
                                        {item.seller?.fullName || "Anonymous Seller"}
                                    </p>
                                    {item.seller?.isVerified && (
                                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                                    )}
                                </div>
                                {item.seller?.department && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.seller.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        {item.seller?.mobileNumber ? (
                            <a
                                href={`tel:${item.seller.mobileNumber}`}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-navy/25 transition-all"
                            >
                                <Phone className="w-5 h-5" />
                                {item.seller.mobileNumber}
                            </a>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-muted text-muted-foreground">
                                <MessageCircle className="w-5 h-5" />
                                Contact info not available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
