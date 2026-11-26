import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { MarketplacePhotoUploader } from "./components/MarketplacePhotoUploader";
import './marketplace.css';

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
    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        manufacturedYear: "",
        price: "",
        isNegotiable: false,
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl: string | undefined;
            if (imageFileRef.current) {
                imageUrl = await uploadImage(imageFileRef.current, "marketplace-images");
            }
            await api.post("/marketplace", { ...formData, imageUrl });
            navigate("/marketplace");
        } catch (error) {
            console.error("Failed to list item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="um-editorial um-marketplace">
            <div className="mp-form-wrap">
                <button
                    type="button"
                    className="back-link"
                    onClick={() => navigate("/marketplace")}
                >
                    <ArrowLeft size={15} />
                    Back to Marketplace
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>02</span>/ List an item
                        </p>
                        <h1 className="page-title">
                            List your <span>stuff.</span>
                        </h1>
                        <p className="page-lead">
                            Ready to declutter? Fill in the details below to list your item on the
                            campus marketplace.
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-stack">
                        <MarketplacePhotoUploader
                            imagePreview={imagePreview}
                            subtitle="Drag and drop or click to browse files"
                            onUpload={handleImageUpload}
                            onRemove={() => {
                                setImagePreview(null);
                                imageFileRef.current = null;
                            }}
                        />

                        <div className="field">
                            <label className="field-label" htmlFor="title">
                                Product name
                            </label>
                            <input
                                id="title"
                                className="field-input"
                                placeholder="e.g. Vintage denim jacket"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label className="field-label" htmlFor="category">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="field-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label className="field-label" htmlFor="condition">
                                    Condition
                                </label>
                                <select
                                    id="condition"
                                    className="field-input"
                                    value={formData.condition}
                                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                                >
                                    <option value="">Select condition</option>
                                    {conditions.map(cond => (
                                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="field-input"
                                placeholder="Tell us about the condition, usage, and why you're selling it…"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        <div className="field">
                            <label className="field-label" htmlFor="price">
                                Price (₹)
                            </label>
                            <div className="mp-price-row">
                                <div className="mp-price-input">
                                    <span aria-hidden="true">₹</span>
                                    <input
                                        id="price"
                                        type="number"
                                        className="field-input"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNegotiable}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                                    />
                                    <span className="switch-track">
                                        <span className="switch-thumb" />
                                    </span>
                                    <span className="switch-label">Open to negotiations</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <p className="form-note">
                            By listing, you agree to the marketplace guidelines.
                        </p>
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Listing…
                                </>
                            ) : (
                                <>
                                    List item
                                    <Rocket size={15} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}