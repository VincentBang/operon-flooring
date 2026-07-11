import { useCallback, useEffect, useRef, useState } from "react";
import { loadLocalImage } from "./imageUtils";
import {
  getLocalPhotoDimensionError,
  getLocalPhotoFileError,
  LOCAL_PHOTO_ACCEPT
} from "./photoValidation";
import type { LocalPhoto } from "./types";

export {
  LOCAL_PHOTO_ACCEPT,
  LOCAL_PHOTO_MAX_BYTES,
  LOCAL_PHOTO_MAX_PIXELS
} from "./photoValidation";

export function useLocalPhotoSession() {
  const [photo, setPhoto] = useState<LocalPhoto | null>(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const currentUrlRef = useRef("");
  const requestIdRef = useRef(0);

  const clearPhoto = useCallback(() => {
    requestIdRef.current += 1;
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = "";
    }
    setPhoto(null);
    setError("");
    setIsReading(false);
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  const selectPhoto = useCallback(async (file: File) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fileError = getLocalPhotoFileError(file);
    if (fileError) {
      setError(fileError);
      setIsReading(false);
      return false;
    }

    setError("");
    setIsReading(true);
    const nextUrl = URL.createObjectURL(file);

    try {
      const image = await loadLocalImage(nextUrl);
      if (requestIdRef.current !== requestId) {
        URL.revokeObjectURL(nextUrl);
        return false;
      }
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const dimensionError = getLocalPhotoDimensionError(width, height);
      if (dimensionError) {
        throw new Error(dimensionError);
      }

      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
      currentUrlRef.current = nextUrl;
      setPhoto({
        url: nextUrl,
        name: file.name,
        type: file.type || "image",
        size: file.size,
        width,
        height
      });
      setIsReading(false);
      return true;
    } catch (caught) {
      URL.revokeObjectURL(nextUrl);
      if (requestIdRef.current === requestId) {
        setError(caught instanceof Error ? caught.message : "This browser could not read the selected image.");
        setIsReading(false);
      }
      return false;
    }
  }, []);

  return {
    photo,
    error,
    isReading,
    selectPhoto,
    clearPhoto
  };
}
