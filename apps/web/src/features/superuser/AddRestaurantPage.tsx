import { useState, useRef } from "react";
import { m } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Clock,
    DollarSign,
    FileText,
    Tag,
    ImagePlus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

interface PhotoUploaderProps {
    imagePreview: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}

function PhotoUploader({ imagePreview, onUpload, onRemove }: PhotoUploaderProps) {
    return (
        <div className="space-y-2">
            <Label>Restaurant Photo</Label>
            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-colors overflow-hidden">
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImagePlus className="w-8 h-8 text-brand-orange" />
                        <p className="text-sm">Click to upload a photo</p>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
            </label>
        </div>
    );
}

export function AddRestaurantPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        cuisine: "",
        tags: "",
        address: "",
        phone: "",
        timing: "",
        priceRange: "",
        location: "",
    });

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
            imageFileRef.current = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setImagePreview(null);
        imageFileRef.current = null;
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

            let imageUrl: string | undefined;
            if (imageFileRef.current) {
                imageUrl = await uploadImage(imageFileRef.current, "restaurant-images");
            }

            const tagsArray = form.tags
                ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : undefined;

            await api.post("/food", {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                cuisine: form.cuisine.trim() || undefined,
                tags: tagsArray,
                address: form.address.trim() || undefined,
                phone: form.phone.trim() || undefined,
                timing: form.timing.trim() || undefined,
                priceRange: form.priceRange.trim() || undefined,
                location: form.location.trim(),
                imageUrl,
            });

            navigate("/superuser/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create restaurant");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 gap-2 text-muted-foreground"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-black tracking-tight mb-2">
                    <span className="text-brand-navy">ADD </span>
                    <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">
                        RESTAURANT
                    </span>
                </h1>
                <p className="text-muted-foreground">List a new restaurant on campus</p>
            </m.div>

            <m.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
            >
                <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Restaurant Name *</Label>
                        <div className="relative">
                            <UtensilsCrossed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="e.g., Campus Bites"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Campus Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                value={form.location}
                                onChange={(e) => updateField("location", e.target.value)}
                                placeholder="e.g., Near Student Activity Center"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Cuisine */}
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine Type</Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="cuisine"
                                value={form.cuisine}
                                onChange={(e) => updateField("cuisine", e.target.value)}
                                placeholder="e.g., North Indian, Fast Food, Chinese"
                                className="pl-10"
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
                                placeholder="Brief description of the restaurant..."
                                className="w-full pl-10 p-3 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={form.tags}
                            onChange={(e) => updateField("tags", e.target.value)}
                            placeholder="e.g., AC, Outdoor Seating, Budget, Wifi"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input
                            id="address"
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Shop #4, Student Plaza..."
                        />
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

                    <PhotoUploader
                        imagePreview={imagePreview}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold hover:opacity-90 transition-opacity"
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
            </m.form>
        </div>
    );
}
