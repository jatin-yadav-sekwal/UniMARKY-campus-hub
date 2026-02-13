import { supabase } from "./supabase";

/**
 * Upload a file to Supabase Storage and return its public URL.
 * 
 * @param file     The File object to upload
 * @param bucket   The storage bucket name (e.g. "marketplace-images")
 * @returns        The public URL of the uploaded file
 */
export async function uploadImage(file: File, bucket: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Upload multiple files to Supabase Storage and return their public URLs.
 */
export async function uploadImages(files: File[], bucket: string): Promise<string[]> {
    return Promise.all(files.map(file => uploadImage(file, bucket)));
}
