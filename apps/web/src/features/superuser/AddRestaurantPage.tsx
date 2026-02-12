import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Clock,
    DollarSign,
    FileText,
    Tag,
    Image,
    ArrowLeft,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function AddRestaurantPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        cuisine: "",
        tags: "",
        address: "",
        phone: "",
        timing: "",
        priceRange: "",
        imageUrl: "",
        location: "",
    });

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim()) {
            setError("Name and location are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await api.post("/food", form);
            navigate("/superuser/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create restaurant");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 gap-2 text-muted-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">ADD </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                    RESTAURANT
                </span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Register a new restaurant listing</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <div className="relative">
                        <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="e.g., Pizza Palace"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Describe your restaurant..."
                            className="w-full pl-10 p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cuisine */}
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine Type</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="cuisine"
                                value={form.cuisine}
                                onChange={(e) => updateField("cuisine", e.target.value)}
                                placeholder="e.g., Italian, Indian"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="tags"
                                value={form.tags}
                                onChange={(e) => updateField("tags", e.target.value)}
                                placeholder="Vegetarian, Fast Food"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                value={form.location}
                                onChange={(e) => updateField("location", e.target.value)}
                                placeholder="Near Main Gate"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="address"
                                value={form.address}
                                onChange={(e) => updateField("address", e.target.value)}
                                placeholder="123 University Road"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+91 98765 43210"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-2">
                        <Label htmlFor="timing">Operating Hours</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="timing"
                                value={form.timing}
                                onChange={(e) => updateField("timing", e.target.value)}
                                placeholder="9 AM - 11 PM"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="priceRange"
                                value={form.priceRange}
                                onChange={(e) => updateField("priceRange", e.target.value)}
                                placeholder="₹200-500"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <div className="relative">
                            <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="imageUrl"
                                value={form.imageUrl}
                                onChange={(e) => updateField("imageUrl", e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Create Restaurant
                            </>
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
