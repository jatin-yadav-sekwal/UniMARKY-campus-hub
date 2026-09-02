import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { m } from "motion/react";
import { ArrowLeft, MapPin, ImagePlus, X, Search, Eye, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";

type ItemType = "lost" | "found";

const TYPE_OPTIONS = [
    {
        type: "lost" as ItemType,
        label: "I LOST something",
        icon: Search,
        activeBorder: "border-red-500 bg-red-50 dark:bg-red-500/10",
        activeBg: "bg-red-500",
        activeText: "text-red-500",
        dotBg: "bg-red-500",
    },
    {
        type: "found" as ItemType,
        label: "I FOUND something",
        icon: Eye,
        activeBorder: "border-green-500 bg-green-50 dark:bg-green-500/10",
        activeBg: "bg-green-500",
        activeText: "text-green-500",
        dotBg: "bg-green-500",
    },
];

interface TypeToggleProps {
    currentType: ItemType;
    onSelect: (type: ItemType) => void;
}

function TypeToggle({ currentType, onSelect }: TypeToggleProps) {
    return (
        <div>
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                What are you reporting?
            </Label>
            <div className="grid grid-cols-2 gap-4">
                {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = currentType === opt.type;
                    return (
                        <button
                            key={opt.type}
                            type="button"
                            onClick={() => onSelect(opt.type)}
                            className={`relative p-6 rounded-2xl border-2 transition-[border-color,background-color] duration-300 ${
                                isSelected ? opt.activeBorder : "border-border hover:border-muted-foreground"
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className={`p-4 rounded-2xl ${isSelected ? opt.activeBg : "bg-muted"}`}>
                                    <Icon className={`w-8 h-8 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                                </div>
                                <span className={`text-lg font-bold ${isSelected ? opt.activeText : "text-muted-foreground"}`}>
                                    {opt.label}
                                </span>
                            </div>
                            {isSelected && (
                                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${opt.dotBg}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface PhotoUploaderProps {
    imagePreview: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}

function PhotoUploader({ imagePreview, onUpload, onRemove }: PhotoUploaderProps) {
    return (
        <div>
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                Item Photo (Optional)
            </Label>
            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-colors duration-300 overflow-hidden">
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
                        <ImagePlus className="w-8 h-8 text-teal-500" />
                        <p className="text-sm">Change photo</p>
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

export function EditLostFoundItemPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
        type: "lost" as ItemType,
        location: "",
        imageUrl: "",
    });

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        api.get(`/lostfound/${id}`)
            .then((item) => {
                if (!cancelled) {
                    setFormData({
                        itemName: item.itemName,
                        description: item.description || "",
                        type: item.type as ItemType,
                        location: item.location || "",
                        imageUrl: item.imageUrl || "",
                    });
                    if (item.imageUrl) {
                        setImagePreview(item.imageUrl);
                    }
                }
            })
            .catch((error) => {
                console.error("Failed to fetch item:", error);
            })
            .finally(() => {
                if (!cancelled) {
                    setFetching(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { alert("Max file size is 5MB"); return; }
            imageFileRef.current = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        imageFileRef.current = null;
        setFormData(prev => ({ ...prev, imageUrl: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.imageUrl;
            if (imageFileRef.current) {
                imageUrl = await uploadImage(imageFileRef.current, "lostfound-images");
            }
            await api.patch(`/lostfound/${id}`, { ...formData, imageUrl });
            navigate("/lost-found/my-listings");
        } catch (error) {
            console.error("Failed to update item:", error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500/5 via-background to-emerald-500/5">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/lost-found/my-listings")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Listings
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="text-brand-navy">EDIT </span>
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">REPORT</span>
                    </h1>
                </m.div>

                {/* Form Card */}
                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="relative bg-background rounded-3xl border border-border/50 shadow-xl p-6 md:p-10"
                >
                    <div className="space-y-8">
                        <TypeToggle
                            currentType={formData.type}
                            onSelect={(type) => setFormData(prev => ({ ...prev, type }))}
                        />

                        <PhotoUploader
                            imagePreview={imagePreview}
                            onUpload={handleImageUpload}
                            onRemove={handleRemoveImage}
                        />

                        {/* Item Name */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Item Name
                            </Label>
                            <Input
                                placeholder="e.g. Blue Wallet, Student ID Card, Airpods Pro"
                                value={formData.itemName}
                                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                                className="h-14 rounded-xl border-border/50 text-lg"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                {formData.type === "lost" ? "Where did you lose it?" : "Where did you find it?"}
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Library, Cafeteria, Room 204"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="h-14 pl-12 rounded-xl border-border/50 text-lg"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description" className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                aria-label="Description"
                                placeholder="Provide any distinguishing features or additional details..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-4 rounded-xl border border-border/50 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-border/50 flex justify-end">
                        <m.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-6 rounded-full font-bold text-lg shadow-lg transition-[box-shadow,opacity] gap-2 ${
                                    formData.type === "lost"
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
                                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25"
                                }`}
                            >
                                {loading ? "Saving..." : "SAVE CHANGES"}
                                <Save className="w-5 h-5" />
                            </Button>
                        </m.div>
                    </div>
                </m.form>
            </div>
        </div>
    );
}
