// src/lib/imageCompressor.js

/* ------------------------------------------------------------
   Configuration
   ------------------------------------------------------------ */
const MAX_DIMENSION = 800;
const WEBP_QUALITY = 0.85;
const TARGET_MIME = "image/webp";

/* ------------------------------------------------------------
   Compress an image File/Blob to WebP, max 800×800.
   Returns the compressed Blob plus size/dimension metadata.
   ------------------------------------------------------------ */
export async function compressImage(file) {
  const img = await loadImage(file);

  const { width, height } = fitDimensions(img.width, img.height, MAX_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Could not get a 2D drawing context.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, TARGET_MIME, WEBP_QUALITY);
  if (!blob) throw new Error("Could not compress the image.");

  return {
    blob,
    width,
    height,
    size: blob.size,
    originalSize: file.size,
    originalWidth: img.width,
    originalHeight: img.height,
  };
}

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */

function fitDimensions(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = Math.min(max / w, max / h);
  return {
    width: Math.round(w * ratio),
    height: Math.round(h * ratio),
  };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image file."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}