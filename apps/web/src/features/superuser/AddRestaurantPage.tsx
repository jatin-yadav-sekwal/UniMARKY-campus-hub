import { useState, useRef } from "react";
import { m } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import {
    RestaurantFormFields,
    type RestaurantFormValues,
} from "./RestaurantFormFields";
import "./superuser.css";

export function AddRestaurantPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [form, setForm] = useState<RestaurantFormValues>({
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

    const updateField = (field: keyof RestaurantFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Max 5MB");
                return;
            }
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
        <div className="um-editorial um-superuser su-food">
            <div className="su-form-wrap">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-link"
                >
                    <ArrowLeft size={15} /> Back
                </button>

                <header className="page-head">
                    <div>
                        <p className="section-label">
                            <span>02</span>/ Restaurants
                        </p>
                        <h1 className="page-title">
                            Add a <span>restaurant.</span>
                        </h1>
                        <p className="page-lead">List a new restaurant on campus.</p>
                    </div>
                </header>

                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="form-card"
                >
                    <RestaurantFormFields
                        form={form}
                        onChange={updateField}
                        imagePreview={imagePreview}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                    />

                    {error && (
                        <div className="alert alert-error alert-row" role="alert">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={saving}
                            className="button button-primary"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} /> Create restaurant
                                </>
                            )}
                        </button>
                    </div>
                </m.form>
            </div>
        </div>
    );
}
