export interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

// Balanced defaults: ~1600px max side, quality 0.8
const DEFAULT_OPTIONS: Required<CompressOptions> = {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.8
};

/**
 * Compress an image on the client using canvas.
 * Returns the original file if compression fails or is not beneficial.
 */
export async function compressImage(file: File, options?: CompressOptions): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...(options || {}) };

    // Only handle common raster images; skip gifs/svg
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;

        let targetWidth = width;
        let targetHeight = height;

        if (width > opts.maxWidth || height > opts.maxHeight) {
            const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
            targetWidth = Math.round(width * ratio);
            targetHeight = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return file;

        ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

        const mimeType = "image/webp";

        const blob: Blob | null = await new Promise((resolve) => {
            canvas.toBlob(
                (b) => resolve(b),
                mimeType,
                opts.quality
            );
        });

        if (!blob) return file;

        // If compression is not beneficial, keep original
        if (blob.size >= file.size) {
            return file;
        }

        const newName = file.name.replace(/\.[^.]+$/, ".webp");
        return new File([blob], newName, { type: mimeType });
    } catch {
        // On any error, fall back to original
        return file;
    }
}

