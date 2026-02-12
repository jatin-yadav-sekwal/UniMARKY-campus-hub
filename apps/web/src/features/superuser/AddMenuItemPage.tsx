import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Plus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    UtensilsCrossed,
    DollarSign,
    Tag,
    FileText,
    Image,
    Leaf,
    Trash2,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface MenuItem {
    id: string;
    name: string;
    price: string;
    category: string | null;
    description: string | null;
    isVeg: boolean;
    isAvailable: boolean;
}

export function AddMenuItemPage() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [restaurantName, setRestaurantName] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        isVeg: true,
    });

    useEffect(() => {
        fetchRestaurant();
    }, [restaurantId]);

    const fetchRestaurant = async () => {
        try {
            setLoadingMenu(true);
            const data = await api.get(`/food/${restaurantId}`);
            setRestaurantName(data.name);
            setMenuItems(data.menu || []);
        } catch (err) {
            console.error("Failed to fetch restaurant:", err);
        } finally {
            setLoadingMenu(false);
        }
    };

    const updateField = (field: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price.trim()) {
            setError("Name and price are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const newItem = await api.post(`/food/${restaurantId}/menu`, form);
            setMenuItems((prev) => [...prev, newItem]);
            setForm({ name: "", description: "", price: "", category: "", imageUrl: "", isVeg: true });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to add menu item");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (menuItemId: string) => {
        if (!confirm("Delete this menu item?")) return;
        setDeleting(menuItemId);
        try {
            await api.delete(`/food/menu/${menuItemId}`);
            setMenuItems((prev) => prev.filter((item) => item.id !== menuItemId));
        } catch (err) {
            console.error("Failed to delete:", err);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">MENU FOR </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                    {restaurantName || "RESTAURANT"}
                </span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Add and manage menu items</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-background border border-border/50 rounded-2xl p-6 space-y-5 h-fit"
                >
                    <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Add Menu Item
                    </h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <div className="relative">
                            <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Margherita Pizza" className="pl-10" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Fresh mozzarella, basil..."
                            className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="price" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="299" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="category" value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Main Course" className="pl-10" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://..." />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => updateField("isVeg", !form.isVeg)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${form.isVeg ? "bg-green-50 border-green-300 text-green-700" : "bg-red-50 border-red-300 text-red-700"
                                }`}
                        >
                            <Leaf className="h-4 w-4" />
                            {form.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                        </button>
                    </div>

                    {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                    {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Menu item added!
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>) : (<><Plus className="mr-2 h-4 w-4" /> Add Item</>)}
                    </Button>
                </motion.form>

                {/* Existing Menu Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-bold text-brand-navy mb-4">
                        Current Menu ({menuItems.length} items)
                    </h2>

                    {loadingMenu ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                            <UtensilsCrossed className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                            <p className="text-muted-foreground text-sm">No menu items yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {menuItems.map((item) => (
                                <div key={item.id} className="bg-background border border-border/50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-bold text-brand-orange">₹{item.price}</span>
                                            {item.category && <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{item.category}</span>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleting === item.id}
                                    >
                                        {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
