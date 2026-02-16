/**
 * WhatsApp-style client-side image compression.
 * Resizes the image to a maximum dimension while maintaining aspect ratio,
 * and encodes it as WebP (if supported) or JPEG at a specified quality.
 */
export async function compressImage(file: File): Promise<File | Blob> {
    // Skip compression for non-raster or animated images if needed
    // But for simplicity, we'll try to compress any image/ entry
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                const MAX_DIMENSION = 1600;

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return resolve(file);
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Try WebP first, then fallback to JPEG
                const targetType = 'image/webp';
                const quality = 0.8;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return resolve(file);
                        }

                        // If compressed blob is larger than original, return original
                        if (blob.size > file.size) {
                            return resolve(file);
                        }

                        // Create a new File object from the blob to preserve name (but change extension if needed)
                        const newFileName = file.name.replace(/\.[^/.]+$/, "") + (blob.type === 'image/webp' ? '.webp' : '.jpg');
                        const compressedFile = new File([blob], newFileName, {
                            type: blob.type,
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    targetType,
                    quality
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}
