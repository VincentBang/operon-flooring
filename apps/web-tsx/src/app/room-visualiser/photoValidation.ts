export const LOCAL_PHOTO_MAX_BYTES = 15 * 1024 * 1024;
export const LOCAL_PHOTO_MAX_PIXELS = 32_000_000;
export const LOCAL_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

type LocalPhotoFileCandidate = {
  name: string;
  size: number;
  type: string;
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const allowedNamePattern = /\.(jpe?g|png|webp|heic|heif)$/i;

export function getLocalPhotoFileError(file: LocalPhotoFileCandidate) {
  const hasAllowedType = allowedTypes.has(file.type.toLowerCase());
  if (!hasAllowedType && !allowedNamePattern.test(file.name)) {
    return "Choose a JPEG, PNG, WebP or browser-supported HEIC room photo.";
  }
  if (file.size > LOCAL_PHOTO_MAX_BYTES) {
    return "This photo is larger than 15 MB. Choose a smaller image or an exported copy.";
  }
  return "";
}

export function getLocalPhotoDimensionError(width: number, height: number) {
  if (Math.min(width, height) < 320) {
    return "Choose a room photo at least 320 pixels on its shortest side.";
  }
  if ((width * height) > LOCAL_PHOTO_MAX_PIXELS) {
    return "This high-resolution photo may overload a phone browser. Choose a standard-resolution copy under 32 megapixels.";
  }
  return "";
}
