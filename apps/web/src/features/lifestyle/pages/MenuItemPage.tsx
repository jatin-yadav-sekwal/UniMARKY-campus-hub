import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, Loader2, Leaf, Plus, Minus, Utensils } from 'lucide-react';
import './lifestyle.css';

interface MenuItemDetail {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    isVeg: boolean;
    isAvailable: boolean;
    rating: string;
    reviewCount: number;
    restaurant: {
        id: string;
        name: string;
        location: string;
    };
}

export function MenuItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<MenuItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        api.get(`/food/menu-item/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="um-editorial um-dish">
                <div className="fd-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading dish...</span>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="um-editorial um-dish">
                <div className="empty-state">
                    <span className="empty-icon">
                        <Utensils size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{error || "Menu item not found"}</h3>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const price = parseFloat(item.price) || 0;
    const totalPrice = price * quantity;

    return (
        <div className="um-editorial um-dish">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="back-link"
            >
                <ArrowLeft size={15} /> Back to Menu
            </button>

            <div className="dsh-grid">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="dsh-media">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} decoding="async" fetchPriority="high" />
                        ) : (
                            <span className="dsh-media-empty">
                                <Utensils size={48} strokeWidth={1.2} />
                            </span>
                        )}
                    </div>
                </m.div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="dsh-details"
                >
                    <div className="dsh-tags">
                        <span className={`dsh-veg${item.isVeg ? '' : ' nonveg'}`}>
                            {item.isVeg ? <Leaf size={12} /> : null}
                            {item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
                        </span>
                        {item.category && <span className="dsh-cat">{item.category}</span>}
                    </div>

                    <h1 className="dsh-title">{item.name}</h1>

                    <Link to={`/food/${item.restaurant.id}`} className="dsh-from">
                        from {item.restaurant.name}
                        {item.restaurant.location ? `, ${item.restaurant.location}` : ''}
                    </Link>

                    <div className="dsh-rating">
                        <Star size={15} fill="currentColor" />
                        <b>{(parseFloat(item.rating) || 0).toFixed(1)}</b>
                        <span>{item.reviewCount} reviews</span>
                    </div>

                    {item.description && (
                        <div className="dsh-desc">
                            <h3>Description</h3>
                            <p>{item.description}</p>
                        </div>
                    )}

                    <div className="dsh-order">
                        <div className="dsh-order-row">
                            <div>
                                <p className="dsh-price-label">Price per item</p>
                                <p className="dsh-price">₹{price.toFixed(0)}</p>
                            </div>

                            <div className="dsh-qty">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} />
                                </button>
                                <span>{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="dsh-total">
                            <span className="dsh-total-label">Total</span>
                            <span className="dsh-total-value">₹{totalPrice.toFixed(0)}</span>
                        </div>
                    </div>

                    {!item.isAvailable && (
                        <div className="dsh-unavailable">Currently unavailable</div>
                    )}
                </m.div>
            </div>
        </div>
    );
}
