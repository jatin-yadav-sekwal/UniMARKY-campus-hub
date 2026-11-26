import { ImagePlus, X } from "lucide-react";

interface MarketplacePhotoUploaderProps {
    imagePreview: string | null;
    subtitle?: string;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
}

export function MarketplacePhotoUploader({
    imagePreview,
    subtitle = "Drag and drop or click to browse files",
    onUpload,
    onRemove,
}: MarketplacePhotoUploaderProps) {
    return (
        <div className="field">
            <span className="field-label">Product photos</span>
            <label className="upload">
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" />
                        <button
                            type="button"
                            aria-label="Remove photo"
                            className="upload-remove"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <span className="upload-empty">
                        <ImagePlus size={26} strokeWidth={1.5} />
                        <strong>Upload photo</strong>
                        <small>{subtitle}</small>
                    </span>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="sr-only"
                />
            </label>
        </div>
    );
}