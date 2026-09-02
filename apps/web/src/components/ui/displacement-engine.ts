export interface LensGeometry {
    width: number;
    height: number;
    radius?: number;
    depth?: number;
    curvature?: number;
    splay?: number;
}

// In-memory cache for displacement map data URLs to avoid regenerating when position changes
const mapCache = new Map<string, string>();
const MAX_CACHE_SIZE = 50;

/**
 * Procedurally generates an Aave-inspired 4-quadrant symmetric displacement map.
 * 
 * - Red Channel (R): Horizontal light displacement (dx), 128 = 0 neutral
 * - Green Channel (G): Vertical light displacement (dy), 128 = 0 neutral
 * - Blue Channel (B): Surface height gradient / normal z component
 * - Alpha Channel (A): 255
 */
export function generateDisplacementMap({
    width,
    height,
    radius = 24,
    depth = 0.5,
    curvature = 0.65,
    splay = 1.0,
}: LensGeometry): string {
    if (typeof window === "undefined" || width <= 0 || height <= 0) {
        return "";
    }

    // Quantize dimensions to reduce cache thrashing during minor subpixel resizes
    const w = Math.max(16, Math.round(width / 2) * 2);
    const h = Math.max(16, Math.round(height / 2) * 2);
    const r = Math.min(Math.round(radius), w / 2, h / 2);
    const dVal = Math.round(depth * 100) / 100;
    const cVal = Math.round(curvature * 100) / 100;
    const sVal = Math.round(splay * 100) / 100;

    const cacheKey = `${w}_${h}_${r}_${dVal}_${cVal}_${sVal}`;
    if (mapCache.has(cacheKey)) {
        return mapCache.get(cacheKey)!;
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "";

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const halfW = w / 2;
    const halfH = h / 2;
    const safeRadius = Math.max(1, r);

    // Compute ONLY the top-left quadrant (4-fold quadrant symmetry optimization)
    for (let y = 0; y < halfH; y++) {
        for (let x = 0; x < halfW; x++) {
            let nx = 0;
            let ny = 0;
            let nz = 1;

            // Check if pixel is within corner radius zone
            if (x < safeRadius && y < safeRadius) {
                const distFromCornerX = safeRadius - x;
                const distFromCornerY = safeRadius - y;
                const dist = Math.sqrt(distFromCornerX * distFromCornerX + distFromCornerY * distFromCornerY);

                if (dist > 0 && dist <= safeRadius) {
                    const norm = Math.pow(dist / safeRadius, cVal) * dVal * sVal;
                    nx = -(distFromCornerX / dist) * norm;
                    ny = -(distFromCornerY / dist) * norm;
                    nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
                }
            } else {
                // Edge gradient falloff
                const edgeX = x / halfW;
                const edgeY = y / halfH;
                const falloffX = Math.pow(1 - edgeX, 2) * dVal * sVal;
                const falloffY = Math.pow(1 - edgeY, 2) * dVal * sVal;
                nx = -falloffX;
                ny = -falloffY;
                nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            }

            // Encode to 8-bit color channels (128 = 0 neutral)
            const rVal = Math.min(255, Math.max(0, Math.round(128 + nx * 127)));
            const gVal = Math.min(255, Math.max(0, Math.round(128 + ny * 127)));
            const bVal = Math.min(255, Math.max(0, Math.round(nz * 255)));

            // 4-Quadrant Symmetrical Mapping:
            // 1. Top-Left: (x, y) -> (nx, ny)
            const tlIdx = (y * w + x) * 4;
            data[tlIdx] = rVal;
            data[tlIdx + 1] = gVal;
            data[tlIdx + 2] = bVal;
            data[tlIdx + 3] = 255;

            // 2. Top-Right: (w - 1 - x, y) -> (-nx, ny) -> Invert R
            const trX = w - 1 - x;
            const trIdx = (y * w + trX) * 4;
            data[trIdx] = 255 - rVal;
            data[trIdx + 1] = gVal;
            data[trIdx + 2] = bVal;
            data[trIdx + 3] = 255;

            // 3. Bottom-Left: (x, h - 1 - y) -> (nx, -ny) -> Invert G
            const blY = h - 1 - y;
            const blIdx = (blY * w + x) * 4;
            data[blIdx] = rVal;
            data[blIdx + 1] = 255 - gVal;
            data[blIdx + 2] = bVal;
            data[blIdx + 3] = 255;

            // 4. Bottom-Right: (w - 1 - x, h - 1 - y) -> (-nx, -ny) -> Invert R and G
            const brIdx = (blY * w + trX) * 4;
            data[brIdx] = 255 - rVal;
            data[brIdx + 1] = 255 - gVal;
            data[brIdx + 2] = bVal;
            data[brIdx + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");

    // Maintain LRU cache size
    if (mapCache.size >= MAX_CACHE_SIZE) {
        const firstKey = mapCache.keys().next().value;
        if (firstKey) mapCache.delete(firstKey);
    }
    mapCache.set(cacheKey, dataUrl);

    return dataUrl;
}
