import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Building2,
    MapPin,
    Phone,
    ArrowLeft,
    Loader2,
    Save,
    Wifi,
    ImagePlus,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";

const ACCOMMODATION_TYPES = ["PG", "Hostel", "Apartment"] as const;

export function EditAccommodationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [form, setForm] = useState({
        name: "",
        type: "PG" as string,
        description: "",
        address: "",
        phone: "",
        amenities: "",
        minPrice: "",
        maxPrice: "",
        rentRange: "",
        location: "",
        contact: "",
    });

    useEffect(() => {
        fetchAccommodation();
    }, [id]);

    const fetchAccommodation = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/accommodation/${id}`);
            setForm({
                name: data.name || "",
                type: data.type || "PG",
                description: data.description || "",
                address: data.address || "",
                phone: data.phone || "",
                amenities: data.amenities || "",
                minPrice: data.minPrice || "",
                maxPrice: data.maxPrice || "",
                rentRange: data.rentRange || "",
                location: data.location || "",
                contact: data.contact || "",
            });
            if (data.images && Array.isArray(data.images)) {
                setExistingImages(data.images);
            }
        } catch (err) {
            setError("Failed to load accommodation");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            let newImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                newImageUrls = await uploadImages(imageFiles, "accommodation-images");
            }
            const allImages = [...existingImages, ...newImageUrls];
            await api.patch(`/accommodation/${id}`, { ...form, images: allImages });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update accommodation");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">ACCOMMODATION</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">Update accommodation details</p>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="pl-10" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex gap-3">
                        {ACCOMMODATION_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => updateField("type", t)}
                                className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${form.type === t ? "bg-brand-navy text-white border-brand-navy" : "bg-background text-muted-foreground border-border"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
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
                        <Label htmlFor="contact">Contact Person</Label>
                        <Input id="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price</Label>
                        <Input id="minPrice" value={form.minPrice} onChange={(e) => updateField("minPrice", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price</Label>
                        <Input id="maxPrice" value={form.maxPrice} onChange={(e) => updateField("maxPrice", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rentRange">Rent Range</Label>
                        <Input id="rentRange" value={form.rentRange} onChange={(e) => updateField("rentRange", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <div className="relative">
                            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="amenities" value={form.amenities} onChange={(e) => updateField("amenities", e.target.value)} className="pl-10" />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {existingImages.map((url, i) => (
                            <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.map((preview, i) => (
                            <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-blue-300">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFiles(prev => prev.filter((_, idx) => idx !== i));
                                        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {(existingImages.length + imagePreviews.length) < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                <ImagePlus className="w-6 h-6 text-blue-500" />
                                <p className="text-[10px] text-muted-foreground mt-1">Add</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const remaining = 5 - existingImages.length - imageFiles.length;
                                        const newFiles = files.slice(0, remaining).filter(f => f.size <= 5 * 1024 * 1024);
                                        setImageFiles(prev => [...prev, ...newFiles]);
                                        setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
                                        e.target.value = "";
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        Accommodation updated successfully!
                    </motion.div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navy/90 hover:from-blue-500 hover:to-indigo-500 font-bold transition-all duration-300"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Save Changes</>)}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
