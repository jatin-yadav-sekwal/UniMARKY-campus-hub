import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { ArrowLeft, Star, Loader2, Leaf, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-lg text-muted-foreground">{error || "Menu item not found"}</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    const price = parseFloat(item.price);
    const totalPrice = price * quantity;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Menu
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                🍽️
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
                    {/* Veg/Non-Veg & Category */}
                    <div className="flex items-center gap-3 mb-4">
                        {item.isVeg ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 text-sm font-medium">
                                <Leaf className="w-4 h-4" />
                                Vegetarian
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 text-sm font-medium">
                                🍗 Non-Vegetarian
                            </span>
                        )}
                        {item.category && (
                            <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                                {item.category}
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
                        {item.name}
                    </h1>

                    {/* Restaurant Link */}
                    <Link
                        to={`/food/${item.restaurant.id}`}
                        className="text-orange-500 hover:text-orange-600 font-medium mb-4"
                    >
                        from {item.restaurant.name}, {item.restaurant.location}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg">{parseFloat(item.rating).toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">
                            {item.reviewCount} reviews
                        </span>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                Description
                            </h3>
                            <p className="text-foreground leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Price & Quantity */}
                    <div className="mt-auto">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Price per item</p>
                                    <p className="text-2xl font-black text-foreground">₹{price.toFixed(0)}</p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <span className="text-muted-foreground">Total</span>
                                <span className="text-3xl font-black text-orange-500">₹{totalPrice.toFixed(0)}</span>
                            </div>
                        </div>

                        {/* Availability */}
                        {!item.isAvailable && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-center font-medium">
                                Currently unavailable
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
