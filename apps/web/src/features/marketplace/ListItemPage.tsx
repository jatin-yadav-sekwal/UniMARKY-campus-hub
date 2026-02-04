import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Upload, Tag, DollarSign, Calendar, FileText, Rocket, ArrowLeft, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const categories = [
    { value: "textbooks", label: "Textbooks" },
    { value: "electronics", label: "Electronics" },
    { value: "dorm-decor", label: "Dorm Decor" },
    { value: "fashion", label: "Fashion" },
    { value: "services", label: "Services" },
    { value: "fitness", label: "Fitness" },
    { value: "other", label: "Other" },
];

const conditions = [
    { value: "new", label: "Brand New" },
    { value: "like-new", label: "Like New" },
    { value: "great", label: "Great Condition" },
    { value: "good", label: "Good Condition" },
    { value: "fair", label: "Fair Condition" },
];

export function ListItemPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        manufacturedYear: "",
        price: "",
        isNegotiable: false,
        imageUrl: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // In a real app, you'd upload to storage and get URL
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/marketplace", formData);
            navigate("/marketplace");
        } catch (error) {
            console.error("Failed to list item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-orange/5 via-background to-brand-yellow/5">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/marketplace")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Marketplace
                    </button>

                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-orange mb-2">
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                        MERCHANT DASHBOARD
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="text-brand-navy">LIST YOUR </span>
                        <span className="bg-gradient-to-r from-brand-orange to-brand-yellow bg-clip-text text-transparent">STUFF.</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Ready to declutter? Fill in the details below to list your item on the campus marketplace.
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
                    {/* Decorative Tag */}
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-brand-orange/10 rounded-2xl rotate-12 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-brand-orange -rotate-12" />
                    </div>

                    <div className="space-y-8">
                        {/* Product Photos */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Product Photos
                            </Label>
                            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300 overflow-hidden">
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
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <div className="p-4 rounded-2xl bg-brand-orange/10">
                                            <ImagePlus className="w-8 h-8 text-brand-orange" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-foreground">Upload high-res images</p>
                                            <p className="text-sm">Drag and drop or click to browse files</p>
                                        </div>
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

                        {/* Product Name */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Product Name
                            </Label>
                            <Input
                                placeholder="e.g. Vintage Denim Jacket"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="h-14 rounded-xl border-border/50 text-lg"
                                required
                            />
                        </div>

                        {/* Category & Year Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                    Category
                                </Label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full h-14 px-4 rounded-xl border border-border/50 bg-background text-foreground text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                    Condition
                                </Label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                                    className="w-full h-14 px-4 rounded-xl border border-border/50 bg-background text-foreground text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                                >
                                    <option value="">Select Condition</option>
                                    {conditions.map(cond => (
                                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Description
                            </Label>
                            <textarea
                                placeholder="Tell us about the condition, usage, and why you're selling it..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-4 rounded-xl border border-border/50 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                            />
                        </div>

                        {/* Price Section */}
                        <div>
                            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                                Price (₹)
                            </Label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className="h-14 pl-8 rounded-xl border-border/50 text-lg"
                                        required
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.isNegotiable}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-brand-orange transition-colors" />
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                                    </div>
                                    <span className="text-sm font-medium whitespace-nowrap">Open to negotiations</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            By listing, you agree to{" "}
                            <a href="#" className="text-brand-orange hover:underline">UNMARKY's Marketplace Guidelines</a>.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-6 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white font-bold text-lg shadow-lg shadow-brand-orange/25 hover:shadow-xl transition-all gap-2"
                            >
                                {loading ? "Listing..." : "LIST ITEM"}
                                <Rocket className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
