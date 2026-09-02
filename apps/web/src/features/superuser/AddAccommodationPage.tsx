import { useState, useRef, useEffect } from "react";
import { m } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    MapPin,
    Phone,
    DollarSign,
    FileText,
    ImagePlus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Wifi,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";

const ACCOMMODATION_TYPES = ["PG", "Hostel", "Apartment"] as const;

export function AddAccommodationPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const imageFilesRef = useRef<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [imagePreviews]);

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

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim() || !form.type) {
            setError("Name, type, and location are required");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            let images: string[] = [];
            if (imageFilesRef.current.length > 0) {
                images = await uploadImages(imageFilesRef.current, "accommodation-images");
            }
            await api.post("/accommodation", { ...form, images });
            navigate("/superuser/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create accommodation");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <m.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            >
                <span className="text-brand-navy">ADD </span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">ACCOMMODATION</span>
            </m.h1>
            <p className="text-muted-foreground mb-8">List a new accommodation near campus</p>

            <m.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-background border border-border/50 rounded-2xl p-6 sm:p-8 space-y-6"
            >
                <div className="space-y-2">
                    <Label htmlFor="name">Accommodation Name *</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Sunrise PG" className="pl-10" required />
                    </div>
                </div>

                {/* Type Selector */}
                <div className="space-y-2">
                    <Label>Type *</Label>
                    <div className="flex gap-3">
                        {ACCOMMODATION_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => updateField("type", t)}
                                className={`px-4 py-2 rounded-xl border font-medium text-sm transition-colors ${form.type === t
                                    ? "bg-brand-navy text-white border-brand-navy"
                                    : "bg-background text-muted-foreground border-border hover:border-brand-navy/30"
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
                        placeholder="Describe the accommodation..."
                        className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[100px] resize-y"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Near University Gate" className="pl-10" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 College Road" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact">Contact Person</Label>
                        <Input id="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="Mr. Sharma" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Min Price (₹/month)</Label>
                        <Input id="minPrice" value={form.minPrice} onChange={(e) => updateField("minPrice", e.target.value)} placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Max Price (₹/month)</Label>
                        <Input id="maxPrice" value={form.maxPrice} onChange={(e) => updateField("maxPrice", e.target.value)} placeholder="12000" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rentRange">Rent Range Display</Label>
                        <Input id="rentRange" value={form.rentRange} onChange={(e) => updateField("rentRange", e.target.value)} placeholder="₹5,000 - ₹12,000 / month" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <div className="relative">
                            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="amenities" value={form.amenities} onChange={(e) => updateField("amenities", e.target.value)} placeholder="WiFi, AC, Laundry, Gym, Parking" className="pl-10" />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Photos (up to 5)</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((preview) => (
                            <div key={preview} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    aria-label="Remove photo"
                                    onClick={() => {
                                        const idx = imagePreviews.indexOf(preview);
                                        if (idx !== -1) {
                                            imageFilesRef.current = imageFilesRef.current.filter((_, i) => i !== idx);
                                        }
                                        setImagePreviews(prev => prev.filter(p => p !== preview));
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-background/90 rounded-full hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.length < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors">
                                <ImagePlus className="w-6 h-6 text-blue-500" />
                                <p className="text-[10px] text-muted-foreground mt-1">Add</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    aria-label="Upload accommodation photos"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const remaining = 5 - imagePreviews.length;
                                        const newFiles = files.slice(0, remaining).filter(f => f.size <= 5 * 1024 * 1024);
                                        imageFilesRef.current = [...imageFilesRef.current, ...newFiles];
                                        newFiles.forEach(f => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                if (typeof reader.result === "string") {
                                                    setImagePreviews(prev => [...prev, reader.result as string]);
                                                }
                                            };
                                            reader.readAsDataURL(f);
                                        });
                                        e.target.value = "";
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:opacity-90"
                    >
                        {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>) : (<><CheckCircle2 className="mr-2 h-4 w-4" /> Create Accommodation</>)}
                    </Button>
                </div>
            </m.form>
        </div>
    );
}
