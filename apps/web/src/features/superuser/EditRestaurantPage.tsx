import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
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
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function EditRestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/food/${id}`);
            setForm({
                name: data.name || "",
                description: data.description || "",
                cuisine: data.cuisine || "",
                tags: data.tags || "",
                address: data.address || "",
                phone: data.phone || "",
                timing: data.timing || "",
                priceRange: data.priceRange || "",
                imageUrl: data.imageUrl || "",
                location: data.location || "",
            });
        } catch (err) {
            setError("Failed to load restaurant");
        } finally {
            setLoading(false);
        }
    };

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
            await api.patch(`/food/${id}`, form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update restaurant");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">EDIT </span>
                <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">RESTAURANT</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Update your restaurant details</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <div className="relative">
                        <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="pl-10" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine</Label>
                        <Input id="cuisine" value={form.cuisine} onChange={(e) => updateField("cuisine", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timing">Hours</Label>
                        <Input id="timing" value={form.timing} onChange={(e) => updateField("timing", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <Input id="priceRange" value={form.priceRange} onChange={(e) => updateField("priceRange", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        Restaurant updated successfully!
                    </motion.div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-brand-orange hover:to-brand-yellow font-bold transition-all duration-300"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Save Changes</>)}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
