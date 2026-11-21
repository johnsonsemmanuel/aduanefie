/**
 * Lightweight client-side image compressor for low-bandwidth / 3G farm uploads.
 * Shrinks multi-megabyte phone photos to ~200-300KB JPEG before uploading.
 * Safely returns the original File if not an image, already small, or unsupported.
 */
export const compressImageFile = async (
  file,
  { maxWidth = 1280, quality = 0.78, minSizeBytes = 300 * 1024 } = {}
) => {
  if (
    typeof window === "undefined" ||
    !file ||
    !file.type?.startsWith("image/") ||
    file.size <= minSizeBytes
  ) {
    return file;
  }

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const cleanName = (file.name || "photo.jpg").replace(/\.[^/.]+$/, "") + ".jpg";
    return new File([blob], cleanName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
};

export const compressImageFiles = async (files, options) => {
  const list = Array.from(files || []);
  return Promise.all(list.map((f) => compressImageFile(f, options)));
};
