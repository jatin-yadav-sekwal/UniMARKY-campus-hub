import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Clock, Phone, Loader2, Leaf, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Restaurant not found"}</p>
                <Button onClick={() => navigate("/food")} variant="outline">
                    Back to Food Zone
                </Button>
            </div>
        );
    }

    // Get unique categories
    const categories = ["all", ...new Set(restaurant.menu.map(item => item.category).filter(Boolean))];

    // Filter menu by category
    const filteredMenu = activeCategory === "all"
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
        <div className="max-w-6xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/food")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Food Zone
            </motion.button>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-8"
            >
                <div className="aspect-[21/9] relative">
                    {restaurant.imageUrl ? (
                        <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-bold">
                                {restaurant.cuisine}
                            </span>
                            {restaurant.priceRange && (
                                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                                    {restaurant.priceRange}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
                            {restaurant.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-1.5">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                <span className="text-white/60">({restaurant.reviewCount} reviews)</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {restaurant.timing}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {restaurant.location}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
                {/* About */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                    <p className="text-foreground leading-relaxed">{restaurant.description}</p>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
                    {restaurant.address && (
                        <p className="flex items-start gap-2 text-foreground mb-2">
                            <MapPin className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                            {restaurant.address}
                        </p>
                    )}
                    {restaurant.phone && (
                        <a
                            href={`tel:${restaurant.phone}`}
                            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mt-3"
                        >
                            <Phone className="w-4 h-4" />
                            {restaurant.phone}
                        </a>
                    )}
                </div>
            </motion.div>

            {/* Menu Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-foreground">MENU</h2>
                    <span className="text-sm text-muted-foreground">{restaurant.menu.length} items</span>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? "bg-orange-500 text-white"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {cat === "all" ? "All Items" : cat}
                        </button>
                    ))}
                </div>

                {/* Menu Items by Category */}
                {Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-orange-500 rounded-full" />
                            {category}
                        </h3>
                        <div className="grid gap-4">
                            {items.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/food/menu/${item.id}`}
                                    className="group flex gap-4 p-4 rounded-2xl bg-background border border-border/50 hover:border-orange-500/50 hover:shadow-lg transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                🍽️
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {item.isVeg ? (
                                                        <span className="w-4 h-4 border-2 border-green-500 flex items-center justify-center rounded-sm">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                        </span>
                                                    ) : (
                                                        <span className="w-4 h-4 border-2 border-red-500 flex items-center justify-center rounded-sm">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                                                        </span>
                                                    )}
                                                    <h4 className="font-bold text-foreground group-hover:text-orange-500 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        {parseFloat(item.rating).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-lg text-foreground">₹{parseFloat(item.price).toFixed(0)}</p>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 ml-auto mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {restaurant.menu.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No menu items available yet.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
