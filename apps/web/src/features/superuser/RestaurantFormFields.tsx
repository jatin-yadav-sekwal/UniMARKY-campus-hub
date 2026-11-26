import {
    UtensilsCrossed,
    MapPin,
    Phone,
    Clock,
    DollarSign,
    FileText,
    Tag,
    ImagePlus,
    X,
} from 'lucide-react';

export interface RestaurantFormValues {
    name: string;
    description: string;
    cuisine: string;
    tags: string;
    address: string;
    phone: string;
    timing: string;
    priceRange: string;
    location: string;
}

interface RestaurantFormFieldsProps {
    form: RestaurantFormValues;
    onChange: (field: keyof RestaurantFormValues, value: string) => void;
    imagePreview: string | null;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}

/**
 * Shared field markup for the add + edit restaurant forms so the two pages
 * cannot drift apart. The pages keep their own submit logic.
 */
export function RestaurantFormFields({
    form,
    onChange,
    imagePreview,
    onUpload,
    onRemove,
}: RestaurantFormFieldsProps) {
    return (
        <div className="form-stack">
            <div className="field">
                <label className="field-label" htmlFor="su-rest-name">
                    Restaurant name *
                </label>
                <div className="su-field">
                    <UtensilsCrossed size={15} />
                    <input
                        id="su-rest-name"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        placeholder="e.g., Campus Bites"
                        className="field-input"
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-location">
                    Campus location *
                </label>
                <div className="su-field">
                    <MapPin size={15} />
                    <input
                        id="su-rest-location"
                        value={form.location}
                        onChange={(e) => onChange("location", e.target.value)}
                        placeholder="e.g., Near Student Activity Center"
                        className="field-input"
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-cuisine">
                    Cuisine type
                </label>
                <div className="su-field">
                    <Tag size={15} />
                    <input
                        id="su-rest-cuisine"
                        value={form.cuisine}
                        onChange={(e) => onChange("cuisine", e.target.value)}
                        placeholder="e.g., North Indian, Fast Food, Chinese"
                        className="field-input"
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-description">
                    Description
                </label>
                <div className="su-field su-field-textarea">
                    <FileText size={15} />
                    <textarea
                        id="su-rest-description"
                        value={form.description}
                        onChange={(e) => onChange("description", e.target.value)}
                        placeholder="Brief description of the restaurant..."
                        rows={4}
                        className="field-input"
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-tags">
                    Tags (comma-separated)
                </label>
                <input
                    id="su-rest-tags"
                    value={form.tags}
                    onChange={(e) => onChange("tags", e.target.value)}
                    placeholder="e.g., AC, Outdoor Seating, Budget, Wifi"
                    className="field-input"
                />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-address">
                    Full address
                </label>
                <input
                    id="su-rest-address"
                    value={form.address}
                    onChange={(e) => onChange("address", e.target.value)}
                    placeholder="Shop #4, Student Plaza..."
                    className="field-input"
                />
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-phone">
                    Phone number
                </label>
                <div className="su-field">
                    <Phone size={15} />
                    <input
                        id="su-rest-phone"
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="field-input"
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-timing">
                    Operating hours
                </label>
                <div className="su-field">
                    <Clock size={15} />
                    <input
                        id="su-rest-timing"
                        value={form.timing}
                        onChange={(e) => onChange("timing", e.target.value)}
                        placeholder="9 AM - 11 PM"
                        className="field-input"
                    />
                </div>
            </div>

            <div className="field">
                <label className="field-label" htmlFor="su-rest-price">
                    Price range
                </label>
                <div className="su-field">
                    <DollarSign size={15} />
                    <input
                        id="su-rest-price"
                        value={form.priceRange}
                        onChange={(e) => onChange("priceRange", e.target.value)}
                        placeholder="₹200-500"
                        className="field-input"
                    />
                </div>
            </div>

            <div>
                <p className="field-label">Restaurant photo</p>
                <label className="su-upload">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRemove();
                                }}
                                aria-label="Remove photo"
                                className="su-upload-remove"
                            >
                                <X size={15} />
                            </button>
                        </>
                    ) : (
                        <span className="su-upload-empty">
                            <ImagePlus size={22} strokeWidth={1.5} />
                            <strong>Click to upload a photo</strong>
                            <small>PNG or JPG, up to 5MB</small>
                        </span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        aria-label="Restaurant photo"
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
}
