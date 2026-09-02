import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

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
        <div>
            <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 block">
                Product Photos
            </Label>
            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-colors duration-300 overflow-hidden">
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-red-50"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <div className="p-4 rounded-2xl bg-brand-orange/10">
                            <ImagePlus className="w-8 h-8 text-brand-orange" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground">Upload photo</p>
                            <p className="text-sm">{subtitle}</p>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
            </label>
        </div>
    );
}
