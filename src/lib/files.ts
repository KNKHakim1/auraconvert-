export const DEFAULT_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: "too-large" | "type-mismatch" | "empty" };

export function validateBrowserFile(
  file: File,
  options: {
    maxBytes?: number;
    allowedMimeTypes?: readonly string[];
  } = {},
): FileValidationResult {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_FILE_SIZE_BYTES;

  if (file.size <= 0) {
    return { ok: false, reason: "empty" };
  }

  if (file.size > maxBytes) {
    return { ok: false, reason: "too-large" };
  }

  if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
    const type = file.type.toLowerCase();
    const allowed = options.allowedMimeTypes.some((item) => item.toLowerCase() === type);
    if (!allowed) {
      return { ok: false, reason: "type-mismatch" };
    }
  }

  return { ok: true };
}
