import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const maxUploadSize = 25 * 1024 * 1024;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseStorageBucket = process.env.SUPABASE_STORAGE_BUCKET;

async function uploadToSupabaseStorage(file: File, bytes: Buffer, filename: string) {
  if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseStorageBucket) {
    return null;
  }

  const objectPath = `demo-uploads/${filename}`;
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${supabaseStorageBucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false"
      },
      body: bytes
    }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Supabase Storage upload failed.");
  }

  return `${supabaseUrl}/storage/v1/object/public/${supabaseStorageBucket}/${objectPath}`;
}

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
  const supabaseUploadUrl = await uploadToSupabaseStorage(file, bytes, filename);

  if (supabaseUploadUrl) {
    return supabaseUploadUrl;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Audio uploads are not configured for production yet. Add SUPABASE_STORAGE_BUCKET in Vercel or submit using the track link only."
    );
  }

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${filename}`;
}
