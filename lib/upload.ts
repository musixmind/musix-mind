import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const maxUploadSize = 25 * 1024 * 1024;

export async function saveUpload(file: File | null) {
  if (!file || file.size === 0) {
    return undefined;
  }

  if (file.size > maxUploadSize) {
    throw new Error("Audio uploads must be 25MB or smaller.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name).toLowerCase() || ".mp3";
  const filename = `${crypto.randomUUID()}${extension}`;

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${filename}`;
}
