import { useRef, useState } from "react";
import { ImagePlus, MapPin, Search, Eye, X } from "lucide-react";
import "./lostfound.css";

export type ItemType = "lost" | "found";

export interface LostFoundFormValues {
    itemName: string;
    description: string;
    type: ItemType;
    location: string;
}

interface LostFoundFormProps {
    initial?: Partial<LostFoundFormValues>;
    initialImage?: string | null;
    submitLabel: string;
    loading: boolean;
    onSubmit: (
        values: LostFoundFormValues,
        imageFile: File | null,
        imageRemoved: boolean
    ) => void;
}

const TYPE_OPTIONS: { type: ItemType; label: string; hint: string; icon: typeof Search }[] = [
    { type: "lost", label: "I lost something", hint: "Someone has it", icon: Search },
    { type: "found", label: "I found something", hint: "Someone lost it", icon: Eye },
];

export function LostFoundForm({
    initial,
    initialImage,
    submitLabel,
    loading,
    onSubmit,
}: LostFoundFormProps) {
    const [values, setValues] = useState<LostFoundFormValues>({
        itemName: initial?.itemName ?? "",
        description: initial?.description ?? "",
        type: initial?.type ?? "lost",
        location: initial?.location ?? "",
    });

    const imageFileRef = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage ?? null);
    const [imageRemoved, setImageRemoved] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Max file size is 5MB");
            return;
        }
        imageFileRef.current = file;
        setImageRemoved(false);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        imageFileRef.current = null;
        setImageRemoved(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values, imageFileRef.current, imageRemoved);
    };

    return (
        <form onSubmit={submit} className="form-card">
            <div className="form-stack">
                {/* Type */}
                <div>
                    <p className="field-label">What are you reporting?</p>
                    <div className="lf-toggle" role="group" aria-label="Report type">
                        {TYPE_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const active = values.type === option.type;
                            return (
                                <button
                                    key={option.type}
                                    type="button"
                                    data-type={option.type}
                                    aria-pressed={active}
                                    onClick={() => setValues((prev) => ({ ...prev, type: option.type }))}
                                    className={`lf-toggle-opt${active ? " active" : ""}`}
                                >
                                    <span className="lf-toggle-icon">
                                        <Icon size={16} strokeWidth={1.6} />
                                    </span>
                                    <span className="lf-toggle-text">
                                        <strong>{option.label}</strong>
                                        <small>{option.hint}</small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Photo */}
                <div>
                    <p className="field-label">Item photo (optional)</p>
                    <label className="lf-upload">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveImage();
                                    }}
                                    aria-label="Remove photo"
                                    className="lf-upload-remove"
                                >
                                    <X size={15} />
                                </button>
                            </>
                        ) : (
                            <span className="lf-upload-empty">
                                <ImagePlus size={22} strokeWidth={1.5} />
                                <strong>Upload a photo of the item</strong>
                                <small>PNG or JPG, up to 5MB</small>
                            </span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            aria-label="Item photo"
                        />
                    </label>
                </div>

                {/* Item name */}
                <div className="field">
                    <label className="field-label" htmlFor="lf-item-name">
                        Item name
                    </label>
                    <input
                        id="lf-item-name"
                        placeholder="e.g. Blue Wallet, Student ID Card, Airpods Pro"
                        value={values.itemName}
                        onChange={(e) => setValues((prev) => ({ ...prev, itemName: e.target.value }))}
                        className="field-input"
                        required
                    />
                </div>

                {/* Location */}
                <div className="field">
                    <label className="field-label" htmlFor="lf-location">
                        {values.type === "lost" ? "Where did you lose it?" : "Where did you find it?"}
                    </label>
                    <div className="lf-field-with-icon" style={{ position: "relative" }}>
                        <MapPin size={16} className="lf-field-icon" />
                        <input
                            id="lf-location"
                            placeholder="e.g. Library, Cafeteria, Room 204"
                            value={values.location}
                            onChange={(e) => setValues((prev) => ({ ...prev, location: e.target.value }))}
                            className="field-input"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="field">
                    <label className="field-label" htmlFor="lf-description">
                        Description
                    </label>
                    <textarea
                        id="lf-description"
                        placeholder="Provide any distinguishing features or additional details..."
                        value={values.description}
                        onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="field-input"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" disabled={loading} className="button button-primary">
                    {loading ? "Submitting..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
