import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Clock, Phone, Loader2, ChevronRight, Utensils } from 'lucide-react';
import './lifestyle.css';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    isVeg: boolean;
    rating: string;
    reviewCount: number;
}

interface RestaurantDetail {
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
    menu: MenuItem[];
}

export function RestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    useEffect(() => {
        if (!id) return;

        api.get(`/food/${id}`)
            .then(setRestaurant)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="um-editorial um-food">
                <div className="fd-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading restaurant...</span>
                </div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="um-editorial um-food">
                <div className="empty-state">
                    <span className="empty-icon">
                        <Utensils size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{error || "Restaurant not found"}</h3>
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => navigate("/food")}
                    >
                        Back to Eats
                    </button>
                </div>
            </div>
        );
    }

    // Get unique categories
    const categories = [
        "all",
        ...new Set(restaurant.menu.flatMap(item => (item.category ? [item.category] : []))),
    ];

    // Filter menu by category
    const filteredMenu =
        activeCategory === "all"
            ? restaurant.menu
            : restaurant.menu.filter(item => item.category === activeCategory);

    // Group by category for display
    const menuByCategory = filteredMenu.reduce((acc, item) => {
        const cat = item.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const tags = restaurant.tags?.split(",").map(t => t.trim()) || [];

    return (
        <div className="um-editorial um-food">
            <button
                type="button"
                onClick={() => navigate("/food")}
                className="back-link"
            >
                <ArrowLeft size={15} /> Back to Eats
            </button>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fdr-hero"
            >
                <div className="fdr-media">
                    {restaurant.imageUrl ? (
                        <img src={restaurant.imageUrl} alt={restaurant.name} decoding="async" fetchPriority="high" />
                    ) : (
                        <span className="fdr-media-empty">
                            <Utensils size={48} strokeWidth={1.2} />
                        </span>
                    )}
                </div>

                <div className="fdr-hero-body">
                    <div className="fdr-tags">
                        {restaurant.cuisine && (
                            <span className="fdr-tag solid">{restaurant.cuisine}</span>
                        )}
                        {restaurant.priceRange && (
                            <span className="fdr-tag">{restaurant.priceRange}</span>
                        )}
                    </div>

                    <h1 className="fdr-title">{restaurant.name}</h1>

                    <div className="fdr-meta">
                        <span className="star">
                            <Star size={14} fill="currentColor" />
                            <strong>{(parseFloat(restaurant.rating) || 0).toFixed(1)}</strong>
                            <span className="fd-meta-muted">
                                ({restaurant.reviewCount} reviews)
                            </span>
                        </span>
                        {restaurant.timing && (
                            <span>
                                <Clock size={14} /> {restaurant.timing}
                            </span>
                        )}
                        {restaurant.location && (
                            <span>
                                <MapPin size={14} /> {restaurant.location}
                            </span>
                        )}
                    </div>
                </div>
            </m.div>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="fdr-info"
            >
                <div className="fdr-panel">
                    <h3 className="fdr-label">About</h3>
                    <p>{restaurant.description || "No description has been added yet."}</p>

                    {tags.length > 0 && (
                        <div className="fdr-tagcloud">
                            {tags.map((tag) => (
                                <span key={tag} className="fdr-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="fdr-panel">
                    <h3 className="fdr-label">Contact</h3>
                    {restaurant.address && (
                        <p className="fdr-contact-row">
                            <MapPin size={15} />
                            <span>{restaurant.address}</span>
                        </p>
                    )}
                    {restaurant.phone && (
                        <a href={`tel:${restaurant.phone}`} className="fdr-phone">
                            <Phone size={15} />
                            {restaurant.phone}
                        </a>
                    )}
                    {!restaurant.address && !restaurant.phone && (
                        <p>Contact info not available.</p>
                    )}
                </div>
            </m.div>

            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="fdr-menu-head">
                    <h2>Menu</h2>
                    <span className="meta-mono">{restaurant.menu.length} items</span>
                </div>

                {categories.length > 1 && (
                    <div className="fdr-cats" role="group" aria-label="Filter menu by category">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                                className={`fdr-cat${activeCategory === cat ? ' active' : ''}`}
                            >
                                {cat === "all" ? "All items" : cat}
                            </button>
                        ))}
                    </div>
                )}

                {Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category} className="fdr-group">
                        <h3 className="fdr-group-title">{category}</h3>

                        <div className="fdr-items">
                            {items.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/food/menu/${item.id}`}
                                    className="fdr-item"
                                >
                                    <div className="fdr-item-img">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" />
                                        ) : (
                                            <Utensils size={24} strokeWidth={1.4} />
                                        )}
                                    </div>

                                    <div className="fdr-item-body">
                                        <div className="fdr-item-top">
                                            <div style={{ minWidth: 0 }}>
                                                <h4 className="fdr-item-name">
                                                    <span
                                                        className={`fdr-vegdot${item.isVeg ? '' : ' nonveg'}`}
                                                        aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
                                                    >
                                                        <i />
                                                    </span>
                                                    {item.name}
                                                </h4>

                                                {item.description && (
                                                    <p className="fdr-item-desc">{item.description}</p>
                                                )}

                                                <span className="fdr-item-rating">
                                                    <Star size={12} fill="currentColor" />
                                                    {(parseFloat(item.rating) || 0).toFixed(1)}
                                                </span>
                                            </div>

                                            <div className="fdr-item-price">
                                                <p>₹{(parseFloat(item.price) || 0).toFixed(0)}</p>
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {restaurant.menu.length === 0 && (
                    <div className="fdr-menu-empty">No menu items available yet.</div>
                )}
            </m.div>
        </div>
    );
}
