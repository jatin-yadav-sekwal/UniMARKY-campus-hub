import {
    Building2,
    MapPin,
    Phone,
    Wifi,
    ImagePlus,
    X,
} from 'lucide-react';

export interface AccommodationFormValues {
    name: string;
    type: string;
    description: string;
    address: string;
    phone: string;
    amenities: string;
    minPrice: string;
    maxPrice: string;
    rentRange: string;
    location: string;
    contact: string;
}

export const ACCOMMODATION_TYPES = ["PG", "Hostel", "Apartment"] as const;

interface AccommodationFormFieldsProps {
    form: AccommodationFormValues;
    onChange: (field: keyof AccommodationFormValues, value: string) => void;
}

/**
 * Shared field markup for the add + edit accommodation forms. Photo handling
 * stays with each page (the edit page also carries already-uploaded images).
 */
export function AccommodationFormFields({ form, onChange }: AccommodationFormFieldsProps) {
    return (
        <div className="form-stack">
            <div className="field">
                <label className="field-label" htmlFor="su-acc-name">
                    Accommodation name *
                </label>
                <div className="su-field">
                    <Building2 size={15} />
                    <input
                        id="su-acc-name"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        placeholder="e.g., Sunrise PG"
                        className="field-input"
                        required
                    />
                </div>
            </div>

            <div className="field">
                <p className="field-label" id="su-acc-type-label">
                    Type *
                </p>
                <div className="su-choices" role="group" aria-labelledby="su-acc-type-label">
                    {ACCOMMODATION_TYPES.map((type) => {
                        const active = form.type === type;
                        return (
                            <button
                                key={type}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange("type", type)}
                                className={`su-choice${active ? " active" : ""}`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-acc-description">
                    Description
                </label>
                <textarea
                    id="su-acc-description"
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Describe the accommodation..."
                    rows={4}
                    className="field-input"
                />
            </div>

            <div className="form-grid">
                <div className="field">
                    <label className="field-label" htmlFor="su-acc-location">
                        Location *
                    </label>
                    <div className="su-field">
                        <MapPin size={15} />
                        <input
                            id="su-acc-location"
                            value={form.location}
                            onChange={(e) => onChange("location", e.target.value)}
                            placeholder="Near University Gate"
                            className="field-input"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="su-acc-address">
                        Full address
                    </label>
                    <input
                        id="su-acc-address"
                        value={form.address}
                        onChange={(e) => onChange("address", e.target.value)}
                        placeholder="123 College Road"
                        className="field-input"
                    />
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="su-acc-phone">
                        Phone
                    </label>
                    <div className="su-field">
                        <Phone size={15} />
                        <input
                            id="su-acc-phone"
                            value={form.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                            className="field-input"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="su-acc-contact">
                        Contact person
                    </label>
                    <input
                        id="su-acc-contact"
                        value={form.contact}
                        onChange={(e) => onChange("contact", e.target.value)}
                        placeholder="Mr. Sharma"
                        className="field-input"
                    />
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="su-acc-min">
                        Min price (₹/month)
                    </label>
                    <input
                        id="su-acc-min"
                        value={form.minPrice}
                        onChange={(e) => onChange("minPrice", e.target.value)}
                        placeholder="5000"
                        className="field-input"
                    />
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="su-acc-max">
                        Max price (₹/month)
                    </label>
                    <input
                        id="su-acc-max"
                        value={form.maxPrice}
                        onChange={(e) => onChange("maxPrice", e.target.value)}
                        placeholder="12000"
                        className="field-input"
                    />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label className="field-label" htmlFor="su-acc-range">
                        Rent range display
                    </label>
                    <input
                        id="su-acc-range"
                        value={form.rentRange}
                        onChange={(e) => onChange("rentRange", e.target.value)}
                        placeholder="₹5,000 - ₹12,000 / month"
                        className="field-input"
                    />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label className="field-label" htmlFor="su-acc-amenities">
                        Amenities (comma-separated)
                    </label>
                    <div className="su-field">
                        <Wifi size={15} />
                        <input
                            id="su-acc-amenities"
                            value={form.amenities}
                            onChange={(e) => onChange("amenities", e.target.value)}
                            placeholder="WiFi, AC, Laundry, Gym, Parking"
                            className="field-input"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AccommodationPhotosProps {
    existing: string[];
    previews: string[];
    onAddFiles: (files: File[]) => void;
    onRemoveExisting: (url: string) => void;
    onRemovePreview: (preview: string) => void;
}

/** Multi-photo target shared by the add + edit accommodation forms. */
export function AccommodationPhotos({
    existing,
    previews,
    onAddFiles,
    onRemoveExisting,
    onRemovePreview,
}: AccommodationPhotosProps) {
    const total = existing.length + previews.length;

    return (
        <div>
            <p className="field-label">Photos (up to 5)</p>

            <div className="su-photos">
                {existing.map((url) => (
                    <div key={url} className="su-photo">
                        <img src={url} alt="" />
                        <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => onRemoveExisting(url)}
                            className="su-photo-remove"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {previews.map((preview) => (
                    <div key={preview} className="su-photo">
                        <img src={preview} alt="" />
                        <button
                            type="button"
                            aria-label="Remove new photo"
                            onClick={() => onRemovePreview(preview)}
                            className="su-photo-remove"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {total < 5 && (
                    <label className="su-photo-add">
                        <ImagePlus size={18} strokeWidth={1.5} />
                        Add
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            aria-label="Upload accommodation photos"
                            onChange={(e) => {
                                onAddFiles(Array.from(e.target.files || []));
                                e.target.value = "";
                            }}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </div>
    );
}
