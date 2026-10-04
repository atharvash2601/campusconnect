import { createHash } from "node:crypto";
import { failure, success } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function validSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (type === "video/webm") return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  if (type === "video/mp4" || type === "video/quicktime") return String.fromCharCode(...bytes.slice(4, 8)) === "ftyp";
  return false;
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) return failure("Not authenticated", 401);
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > 52 * 1024 * 1024) return failure("Upload must be 50 MB or smaller", 413);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return failure("Choose an image or video to upload");
    const image = imageTypes.has(file.type);
    const video = videoTypes.has(file.type);
    if (!image && !video) return failure("Unsupported file type. Choose a JPEG, PNG, WebP, MP4, WebM, or QuickTime file.");
    if (file.size > (image ? 10 : 50) * 1024 * 1024) return failure(image ? "Images must be 10 MB or smaller" : "Videos must be 50 MB or smaller");
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!validSignature(file.type, bytes)) return failure("The file contents do not match a supported image or video format");

    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !key || !secret) return failure("Cloudinary is not configured. Please add the required Cloudinary environment variables.", 503);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "campus-connect/answers";
    const signedParameters = `folder=${folder}&timestamp=${timestamp}`;
    const signature = createHash("sha1").update(`${signedParameters}${secret}`).digest("hex");
    const uploadForm = new FormData();
    uploadForm.set("file", new Blob([bytes], { type: file.type }), file.name);
    uploadForm.set("api_key", key);
    uploadForm.set("timestamp", timestamp);
    uploadForm.set("folder", folder);
    uploadForm.set("signature", signature);
    const resourceType = image ? "image" : "video";
    let response: Response;
    try {
      response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/${resourceType}/upload`, { method: "POST", body: uploadForm });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        const message = error instanceof Error ? error.message : "Unknown network error";
        console.error("[uploads] Cloudinary request failed:", message.replaceAll(secret, "[redacted]").replaceAll(key, "[redacted]").slice(0, 300));
      }
      return failure("We couldn't upload that file. Please check your connection and try again.", 502);
    }
    const uploaded = await response.json().catch(() => null);
    if (!response.ok || typeof uploaded?.secure_url !== "string" || typeof uploaded?.public_id !== "string") {
      if (process.env.NODE_ENV !== "production") {
        const detail = typeof uploaded?.error?.message === "string" ? uploaded.error.message : "Cloudinary returned an invalid response";
        console.error("[uploads] Cloudinary rejected upload:", response.status, detail.replaceAll(secret, "[redacted]").replaceAll(key, "[redacted]").slice(0, 300));
      }
      return failure("We couldn't upload that file. Please try again with a supported image or video.", 502);
    }
    return success({ type: resourceType, url: uploaded.secure_url, publicId: uploaded.public_id, originalName: file.name.slice(0, 255), size: file.size, contentType: file.type, width: uploaded.width, height: uploaded.height }, "Upload complete", 201);
  } catch {
    return failure("Unable to upload file", 500);
  }
}
