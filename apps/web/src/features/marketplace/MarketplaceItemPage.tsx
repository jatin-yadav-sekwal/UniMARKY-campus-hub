import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Phone, User, BadgeCheck, Tag, Calendar, MessageCircle, Share2, Loader2 } from 'lucide-react';
import './marketplace.css';

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
            className="mpd-media-wrap"
        >
            <div className="mpd-media">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <span className="mpd-media-empty">
                        <Tag size={64} strokeWidth={1.2} />
                    </span>
                )}
            </div>

            <span className={`mpd-badge${isNegotiable ? '' : ' fixed'}`}>
                {isNegotiable ? "Negotiable" : "Fixed price"}
            </span>

            <button
                type="button"
                onClick={onShare}
                aria-label="Share listing"
                className="mpd-share"
            >
                <Share2 size={18} />
            </button>
        </m.div>
    );
}

function MarketplaceSellerCard({ seller }: { seller?: SellerInfo }) {
    return (
        <div className="mpd-seller">
            <h3 className="mpd-desc-label">Contact seller</h3>

            <div className="mpd-seller-head">
                <span className="mpd-avatar">
                    <User size={20} strokeWidth={1.6} />
                </span>
                <div>
                    <p className="mpd-seller-name">
                        {seller?.fullName || "Anonymous Seller"}
                        {seller?.isVerified && (
                            <BadgeCheck className="verified" size={16} />
                        )}
                    </p>
                    {seller?.department && (
                        <p className="mpd-seller-dept">{seller.department}</p>
                    )}
                </div>
            </div>

            {seller?.mobileNumber ? (
                <a
                    href={`tel:${seller.mobileNumber}`}
                    className="button button-primary button-block"
                >
                    <Phone size={16} />
                    {seller.mobileNumber}
                </a>
            ) : (
                <div className="mpd-contact-unavailable">
                    <MessageCircle size={16} />
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
            <div className="um-editorial um-marketplace">
                <div className="mp-spinner">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading listing...</span>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="um-editorial um-marketplace">
                <div className="empty-state">
                    <span className="empty-icon">
                        <Tag size={24} strokeWidth={1.5} />
                    </span>
                    <h3>Item not found</h3>
                    <p>{error || "This listing may have been removed."}</p>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate("/marketplace")}
                    >
                        Back to marketplace
                    </button>
                </div>
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
        <div className="um-editorial um-marketplace">
            <m.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                type="button"
                onClick={() => navigate("/marketplace")}
                className="back-link"
            >
                <ArrowLeft size={15} />
                Back to Marketplace
            </m.button>

            <div className="mpd-grid">
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
                >
                    <div className="mpd-tags">
                        <span className="mpd-tag">
                            {item.category?.replace("-", " ") || "General"}
                        </span>
                        {item.condition && (
                            <span className="mpd-tag">
                                {conditionLabels[item.condition] || item.condition}
                            </span>
                        )}
                    </div>

                    <h1 className="mpd-title">{item.title}</h1>

                    <p className="mpd-date">
                        <Calendar size={13} />
                        Listed on {formattedDate}
                    </p>

                    <div className="mpd-price">
                        <p className="mpd-price-label">Expected price</p>
                        <p className="mpd-price-value">
                            ₹{parseFloat(item.price).toLocaleString()}
                        </p>
                        {item.isNegotiable && (
                            <p className="mpd-negotiable">Open to negotiations</p>
                        )}
                    </div>

                    {item.description && (
                        <div className="mpd-desc">
                            <h3>Description</h3>
                            <p>{item.description}</p>
                        </div>
                    )}

                    <MarketplaceSellerCard seller={item.seller} />
                </m.div>
            </div>
        </div>
    );
}
