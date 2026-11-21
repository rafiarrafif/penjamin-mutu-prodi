import { existsSync, mkdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

export const storageAppDirectory = resolve(process.cwd(), "storage", "app");

const MIME_EXTENSION: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "text/plain": "txt",
  "application/rtf": "rtf",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/csv": "csv",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/zip": "zip",
  "application/x-rar-compressed": "rar",
  "application/x-7z-compressed": "7z",
};

function getExtension(file: Blob & { name?: string }): string {
  if (typeof file.name === "string" && file.name.length > 0) {
    const originalExtension = extname(file.name)
      .replace(/^\./, "")
      .toLowerCase();
    if (/^[a-z0-9]{1,16}$/.test(originalExtension)) {
      return originalExtension;
    }
  }

  const mimeExtension = MIME_EXTENSION[file.type.toLowerCase()];
  if (mimeExtension) return mimeExtension;

  throw new Error(
    "The uploaded file does not have a supported filename extension.",
  );
}

function generateUniqueFilename(extension: string): string {
  mkdirSync(storageAppDirectory, { recursive: true });

  let filename: string;
  do {
    filename = `${crypto.randomUUID().replaceAll("-", "")}.${extension}`;
  } while (existsSync(join(storageAppDirectory, filename)));

  return filename;
}

export async function writeStoredFile(
  file: Blob & { name?: string },
): Promise<string> {
  if (!(file instanceof Blob)) {
    throw new Error("A valid file or blob is required.");
  }

  const extension = getExtension(file);
  const filename = generateUniqueFilename(extension);

  await Bun.write(join(storageAppDirectory, filename), file);
  return filename;
}

export function readStoredFile(filename: string): Blob | null {
  if (
    !filename ||
    basename(filename) !== filename ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return null;
  }

  const filePath = join(storageAppDirectory, filename);
  if (!existsSync(filePath)) return null;

  return Bun.file(filePath);
}
