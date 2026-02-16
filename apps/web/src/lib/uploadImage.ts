import { supabase } from "./supabase";
import { compressImage } from "./compressImage";

interface UploadOptions {
    bucket: string;
    folder?: string;
    compress?: boolean;
}

/**
 * Uploads an image to Supabase Storage with optional compression.
 */
export async function uploadImage(
    file: File,
    options: string | UploadOptions
): Promise<string> {
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

    // Generate a secure, unique file path
    const ext = file.name.split(".").pop();
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
