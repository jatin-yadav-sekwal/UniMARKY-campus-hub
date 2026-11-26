import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { MarketplacePhotoUploader } from "./components/MarketplacePhotoUploader";
import './marketplace.css';

const CATEGORIES = [
    { value: "books", label: "Books & Study Material" },
    { value: "electronics", label: "Electronics & Gadgets" },
    { value: "cycles", label: "Cycles & Mobility" },
    { value: "hostel-essentials", label: "Hostel Essentials" },
    { value: "fashion", label: "Clothing & Fashion" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "other", label: "Other" },
];

const CONDITIONS = [
    { value: "new", label: "Brand New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good Condition" },
    { value: "fair", label: "Fair Condition" },
];

interface SelectFieldsProps {
    category: string;
    condition: string;
    onChangeCategory: (val: string) => void;
    onChangeCondition: (val: string) => void;
}

function CategoryConditionSelects({
    category,
    condition,
    onChangeCategory,
    onChangeCondition,
}: SelectFieldsProps) {
    return (
        <div className="form-grid">
            <div className="field">
                <label className="field-label" htmlFor="category">
                    Category
                </label>
                <select
                    id="category"
                    className="field-input"
                    value={category}
                    onChange={(e) => onChangeCategory(e.target.value)}
                    required
                >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
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
                    value={condition}
                    onChange={(e) => onChangeCondition(e.target.value)}
                >
                    <option value="">Select condition</option>
                    {CONDITIONS.map(cond => (
                        <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

interface PriceInputProps {
    price: string;
    isNegotiable: boolean;
    onPriceChange: (val: string) => void;
    onNegotiableChange: (val: boolean) => void;
}

function PriceNegotiableField({
    price,
    isNegotiable,
    onPriceChange,
    onNegotiableChange,
}: PriceInputProps) {
    return (
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
                        value={price}
                        onChange={(e) => onPriceChange(e.target.value)}
                        required
                    />
                </div>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isNegotiable}
                        onChange={(e) => onNegotiableChange(e.target.checked)}
                    />
                    <span className="switch-track">
                        <span className="switch-thumb" />
                    </span>
                    <span className="switch-label">Open to negotiations</span>
                </label>
            </div>
        </div>
    );
}

export function EditMarketplaceItemPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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
        imageUrl: "",
    });

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        api.get(`/marketplace/${id}`)
            .then((item) => {
                if (!cancelled) {
                    setFormData({
                        title: item.title,
                        description: item.description || "",
                        category: item.category || "",
                        condition: item.condition || "",
                        manufacturedYear: item.manufacturedYear || "",
                        price: item.price,
                        isNegotiable: item.isNegotiable,
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
                imageUrl = await uploadImage(imageFileRef.current, "marketplace-images");
            }

            await api.patch(`/marketplace/${id}`, {
                ...formData,
                imageUrl
            });
            navigate("/marketplace/my-listings");
        } catch (error) {
            console.error("Failed to update item:", error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="um-editorial um-marketplace">
                <div className="mp-spinner">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading listing…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-marketplace">
            <div className="mp-form-wrap">
                <button
                    type="button"
                    className="back-link"
                    onClick={() => navigate("/marketplace/my-listings")}
                >
                    <ArrowLeft size={15} />
                    Back to My Listings
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>02</span>/ Edit listing
                        </p>
                        <h1 className="page-title">
                            Update your <span>item.</span>
                        </h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-stack">
                        <MarketplacePhotoUploader
                            imagePreview={imagePreview}
                            subtitle="Click to change current image"
                            onUpload={handleImageUpload}
                            onRemove={handleRemoveImage}
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

                        <CategoryConditionSelects
                            category={formData.category}
                            condition={formData.condition}
                            onChangeCategory={(val) => setFormData(prev => ({ ...prev, category: val }))}
                            onChangeCondition={(val) => setFormData(prev => ({ ...prev, condition: val }))}
                        />

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

                        <PriceNegotiableField
                            price={formData.price}
                            isNegotiable={formData.isNegotiable}
                            onPriceChange={(val) => setFormData(prev => ({ ...prev, price: val }))}
                            onNegotiableChange={(val) => setFormData(prev => ({ ...prev, isNegotiable: val }))}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    Save changes
                                    <Save size={15} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}