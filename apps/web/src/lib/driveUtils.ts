/**
 * Google Drive URL utility
 * Parses various Google Drive sharing URLs and provides direct download links.
 */

/**
 * Extracts the file ID from a Google Drive URL.
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID&export=download
 * - https://docs.google.com/document/d/FILE_ID/...
 * - https://docs.google.com/spreadsheets/d/FILE_ID/...
 * - https://docs.google.com/presentation/d/FILE_ID/...
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    // Must be a Google domain
    if (!hostname.endsWith("google.com")) return null;

    // Pattern 1: /file/d/FILE_ID/ or /document/d/FILE_ID/ etc.
    const dMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch) return dMatch[1];

    // Pattern 2: ?id=FILE_ID query param
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is a Google Drive/Docs URL
 */
export function isDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "drive.google.com" ||
      parsed.hostname === "docs.google.com"
    );
  } catch {
    return false;
  }
}

/**
 * Gets a direct download URL for a Google Drive file.
 * For publicly shared files, this triggers an immediate download.
 */
export function getDriveDownloadUrl(driveUrl: string): string | null {
  const fileId = extractDriveFileId(driveUrl);
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Gets a preview URL for a Google Drive file (opens in Google's viewer).
 */
export function getDrivePreviewUrl(driveUrl: string): string | null {
  const fileId = extractDriveFileId(driveUrl);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Triggers a download of a Google Drive file.
 * Opens the direct download URL in a new tab — the browser handles the rest.
 * Falls back to opening the original URL if it's not a valid Drive link.
 */
export function downloadFromDrive(url: string): void {
  const downloadUrl = getDriveDownloadUrl(url);
  if (downloadUrl) {
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  } else {
    // Fallback: open the original URL
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Validates that a string is a valid Google Drive sharing URL
 */
export function isValidDriveLink(url: string): boolean {
  if (!url) return false;
  return isDriveUrl(url) && extractDriveFileId(url) !== null;
}
