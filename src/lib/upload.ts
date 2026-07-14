import { randomUUID } from "node:crypto";
import path from "node:path";

export function getUploadDirectory() {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
}

export function buildSafeFilename(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, extension)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 80);

  return `${baseName || "upload"}-${randomUUID()}${extension}`;
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function isPathSafe(candidate: string) {
  return !candidate.includes("..") && !path.isAbsolute(candidate);
}

export function isWithinUploadDirectory(targetPath: string, uploadDirectory: string) {
  const normalizedTargetPath = path.normalize(targetPath);
  const normalizedUploadDirectory = path.normalize(uploadDirectory);

  return (
    normalizedTargetPath === normalizedUploadDirectory ||
    normalizedTargetPath.startsWith(`${normalizedUploadDirectory}${path.sep}`)
  );
}
