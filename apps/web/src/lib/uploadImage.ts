import { supabase } from "./supabase";
import { compressImage } from "./compressImage";

interface UploadOptions {
    bucket: string;
    folder?: string;
    compress?: boolean;
}

// Raster images only: an uploaded SVG can carry script when opened directly,
// so it is deliberately excluded. Keep these in sync with the bucket MIME
// allow-list in Supabase Storage.
const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Uploads an image to Supabase Storage with optional compression.
 */
export async function uploadImage(
    file: File,
    options: string | UploadOptions
): Promise<string> {
    if (!ALLOWED_TYPES[file.type]) {
        throw new Error("Only JPG, PNG, WebP or GIF images are allowed.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error("Images must be 10 MB or smaller.");
    }

    const bucket = typeof options === "string" ? options : options.bucket;
    const folder = typeof options === "string" ? "" : options.folder || "";
    const compress = typeof options === "string" ? true : options.compress !== false;

    let fileToUpload: File | Blob = file;

    if (compress) {
        try {
            fileToUpload = await compressImage(file);
        } catch (error) {
            console.warn("Image compression failed, uploading original:", error);
            fileToUpload = file;
        }
    }

    // Generate a secure, unique file path. The extension comes from the
    // validated MIME type, never from the user-supplied filename.
    const ext = ALLOWED_TYPES[fileToUpload.type] ?? ALLOWED_TYPES[file.type] ?? "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 7);
    const fileName = `${timestamp}-${random}.${ext}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
            contentType: fileToUpload.type,
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw error;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Uploads multiple images concurrently.
 */
export async function uploadImages(
    files: File[],
    options: string | UploadOptions
): Promise<string[]> {
    return Promise.all(files.map((file) => uploadImage(file, options)));
}
