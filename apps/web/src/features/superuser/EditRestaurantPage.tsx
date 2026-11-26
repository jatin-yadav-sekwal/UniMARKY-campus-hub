import { useState, useEffect, useRef } from "react";
import { m } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import {
    RestaurantFormFields,
    type RestaurantFormValues,
} from "./RestaurantFormFields";
import "./superuser.css";

export function EditRestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

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

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        api.get(`/food/${id}`)
            .then((data) => {
                if (!cancelled) {
                    setForm({
                        name: data.name || "",
                        description: data.description || "",
                        cuisine: data.cuisine || "",
                        tags: data.tags || "",
                        address: data.address || "",
                        phone: data.phone || "",
                        timing: data.timing || "",
                        priceRange: data.priceRange || "",
                        location: data.location || "",
                    });
                    if (data.imageUrl) setImagePreview(data.imageUrl);
                }
            })
            .catch(() => {
                if (!cancelled) setError("Failed to load restaurant");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const updateField = (field: keyof RestaurantFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Max 5MB");
            return;
        }
        imageFileRef.current = file;
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
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
            await api.patch(`/food/${id}`, { ...form, ...(imageUrl ? { imageUrl } : {}) });
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
            <div className="um-editorial um-superuser su-food">
                <div className="su-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading restaurant...</span>
                </div>
            </div>
        );
    }

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
                            <span>03</span>/ Restaurants
                        </p>
                        <h1 className="page-title">
                            Edit your <span>restaurant.</span>
                        </h1>
                        <p className="page-lead">Update your restaurant details.</p>
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

                    {success && (
                        <div className="alert alert-success alert-row" role="status">
                            <span>Restaurant updated successfully!</span>
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
                                    <Loader2 size={16} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Save changes
                                </>
                            )}
                        </button>
                    </div>
                </m.form>
            </div>
        </div>
    );
}
