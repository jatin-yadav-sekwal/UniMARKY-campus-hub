import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, ImagePlus, X, Search, Eye, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function ReportItemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
        type: "lost" as "lost" | "found",
        location: "",
        imageUrl: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/lostfound", formData);
            navigate("/lost-found");
        } catch (error) {
            console.error("Failed to report item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-500/5 via-background to-emerald-500/5">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/lost-found")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lost & Found
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="text-brand-navy">REPORT </span>
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">ITEM</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Help your campus community by reporting lost or found items.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="relative bg-background rounded-3xl border border-border/50 shadow-xl p-6 md:p-10"
                >
                    <div className="space-y-8">
                        {/* Type Toggle */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                What are you reporting?
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: "lost" }))}
                                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${formData.type === "lost"
                                            ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-4 rounded-2xl ${formData.type === "lost" ? "bg-red-500" : "bg-muted"}`}>
                                            <Search className={`w-8 h-8 ${formData.type === "lost" ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <span className={`text-lg font-bold ${formData.type === "lost" ? "text-red-500" : "text-muted-foreground"}`}>
                                            I LOST something
                                        </span>
                                    </div>
                                    {formData.type === "lost" && (
                                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: "found" }))}
                                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${formData.type === "found"
                                            ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`p-4 rounded-2xl ${formData.type === "found" ? "bg-green-500" : "bg-muted"}`}>
                                            <Eye className={`w-8 h-8 ${formData.type === "found" ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <span className={`text-lg font-bold ${formData.type === "found" ? "text-green-500" : "text-muted-foreground"}`}>
                                            I FOUND something
                                        </span>
                                    </div>
                                    {formData.type === "found" && (
                                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Item Photo */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Item Photo (Optional)
                            </Label>
                            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all duration-300 overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, imageUrl: "" }));
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ImagePlus className="w-8 h-8 text-teal-500" />
                                        <p className="text-sm">Upload a photo of the item</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

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
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Description
                            </Label>
                            <textarea
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
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-6 rounded-full font-bold text-lg shadow-lg transition-all gap-2 ${formData.type === "lost"
                                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/25"
                                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/25"
                                    }`}
                            >
                                {loading ? "Submitting..." : `REPORT AS ${formData.type.toUpperCase()}`}
                                <Rocket className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
