import { useState, useRef, useEffect } from "react";
import { m } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { uploadImages } from "@/lib/uploadImage";
import {
    AccommodationFormFields,
    AccommodationPhotos,
    type AccommodationFormValues,
} from "./AccommodationFormFields";
import "./superuser.css";

export function AddAccommodationPage() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const imageFilesRef = useRef<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

    const updateField = (field: keyof AccommodationFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddFiles = (files: File[]) => {
        const remaining = 5 - imagePreviews.length;
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
                            <span>02</span>/ Accommodation
                        </p>
                        <h1 className="page-title">
                            Add an <span>accommodation.</span>
                        </h1>
                        <p className="page-lead">List a new accommodation near campus.</p>
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
                            existing={[]}
                            previews={imagePreviews}
                            onAddFiles={handleAddFiles}
                            onRemoveExisting={() => {}}
                            onRemovePreview={handleRemovePreview}
                        />
                    </div>

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
                                    <CheckCircle2 size={16} /> Create accommodation
                                </>
                            )}
                        </button>
                    </div>
                </m.form>
            </div>
        </div>
    );
}
