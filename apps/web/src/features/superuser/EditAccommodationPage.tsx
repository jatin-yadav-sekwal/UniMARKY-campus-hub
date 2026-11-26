import { useState, useEffect, useRef } from "react";
import { m } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";
import {
    AccommodationFormFields,
    AccommodationPhotos,
    type AccommodationFormValues,
} from "./AccommodationFormFields";
import "./superuser.css";

export function EditAccommodationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const imageFilesRef = useRef<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [imagePreviews]);

    const [form, setForm] = useState<AccommodationFormValues>({
        name: "",
        type: "PG",
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
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        api.get(`/accommodation/${id}`)
            .then((data) => {
                if (!cancelled) {
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
                }
            })
            .catch(() => {
                if (!cancelled) setError("Failed to load accommodation");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const updateField = (field: keyof AccommodationFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddFiles = (files: File[]) => {
        const remaining = 5 - existingImages.length - imagePreviews.length;
        const newFiles = files.slice(0, remaining).filter((f) => f.size <= 5 * 1024 * 1024);
        imageFilesRef.current = [...imageFilesRef.current, ...newFiles];
        newFiles.forEach((f) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(f);
        });
    };

    const handleRemovePreview = (preview: string) => {
        const idx = imagePreviews.indexOf(preview);
        if (idx !== -1) {
            imageFilesRef.current = imageFilesRef.current.filter((_, i) => i !== idx);
        }
        setImagePreviews((prev) => prev.filter((p) => p !== preview));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            let newImageUrls: string[] = [];
            if (imageFilesRef.current.length > 0) {
                newImageUrls = await uploadImages(imageFilesRef.current, "accommodation-images");
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
            <div className="um-editorial um-superuser su-stay">
                <div className="su-loading">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading accommodation...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="um-editorial um-superuser su-stay">
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
                            <span>03</span>/ Accommodation
                        </p>
                        <h1 className="page-title">
                            Edit your <span>accommodation.</span>
                        </h1>
                        <p className="page-lead">Update accommodation details.</p>
                    </div>
                </header>

                <m.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="form-card"
                >
                    <div className="form-stack">
                        <AccommodationFormFields form={form} onChange={updateField} />

                        <AccommodationPhotos
                            existing={existingImages}
                            previews={imagePreviews}
                            onAddFiles={handleAddFiles}
                            onRemoveExisting={(url) =>
                                setExistingImages((prev) => prev.filter((img) => img !== url))
                            }
                            onRemovePreview={handleRemovePreview}
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error alert-row" role="alert">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success alert-row" role="status">
                            <span>Accommodation updated successfully!</span>
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
