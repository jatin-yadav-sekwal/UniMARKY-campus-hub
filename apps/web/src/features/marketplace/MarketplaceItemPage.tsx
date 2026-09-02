import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, BadgeCheck, Tag, Calendar, MessageCircle, Share2, Loader2 } from 'lucide-react';
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

function MarketplaceImageCard({
    imageUrl,
    title,
    isNegotiable,
    onShare,
}: {
    imageUrl?: string;
    title: string;
    isNegotiable: boolean;
    onShare: () => void;
}) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                )}
            </div>

            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold ${
                isNegotiable ? "bg-brand-orange text-white" : "bg-brand-navy text-white"
            }`}>
                {isNegotiable ? "NEGOTIABLE" : "FIXED PRICE"}
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={onShare}
                    aria-label="Share listing"
                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors text-brand-navy"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </m.div>
    );
}

function MarketplaceSellerCard({ seller }: { seller?: SellerInfo }) {
    return (
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
                            {seller?.fullName || "Anonymous Seller"}
                        </p>
                        {seller?.isVerified && (
                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                        )}
                    </div>
                    {seller?.department && (
                        <p className="text-sm text-muted-foreground">
                            {seller.department}
                        </p>
                    )}
                </div>
            </div>

            {seller?.mobileNumber ? (
                <a
                    href={`tel:${seller.mobileNumber}`}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-navy/25 transition-shadow"
                >
                    <Phone className="w-5 h-5" />
                    {seller.mobileNumber}
                </a>
            ) : (
                <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-muted text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    Contact info not available
                </div>
            )}
        </div>
    );
}

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

    const handleShare = async () => {
        if (!item) return;
        const shareData = {
            title: item.title,
            text: `Check out this ${item.title} on UniMARKY Marketplace!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <m.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/marketplace")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </m.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MarketplaceImageCard
                    imageUrl={item.imageUrl}
                    title={item.title}
                    isNegotiable={item.isNegotiable}
                    onShare={handleShare}
                />

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
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

                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                        {item.title}
                    </h1>

                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
                        <Calendar className="w-4 h-4" />
                        Listed on {formattedDate}
                    </p>

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

                    <MarketplaceSellerCard seller={item.seller} />
                </m.div>
            </div>
        </div>
    );
}
