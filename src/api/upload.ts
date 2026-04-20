import { http } from "./http";

export type Media = {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type CloudinarySignature = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
};

const CLOUDINARY_VIDEO_LIMIT_BYTES = 100 * 1024 * 1024;
const SERVER_VIDEO_LIMIT_BYTES = 90 * 1024 * 1024;

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function getErrorMessage(error: unknown, fallback = "Unknown error") {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

export async function uploadFile(file: File, token: string) {
  const fd = new FormData();
  fd.append("file", file);
  return http<{ media: Media }>("/api/upload", { method: "POST", body: fd, token });
}

export async function uploadVideoFile(file: File, token: string) {
  const fd = new FormData();
  fd.append("file", file);
  return http<{ media: Media }>("/api/upload-video", { method: "POST", body: fd, token });
}

// Get Cloudinary signature for direct upload (bypasses Railway 100MB limit)
export async function getCloudinarySignature(token: string): Promise<CloudinarySignature> {
  return http<CloudinarySignature>("/api/cloudinary-signature", { method: "GET", token });
}

// Upload directly to Cloudinary (bypasses Railway 100MB limit)
export async function uploadToCloudinary(
  file: File, 
  signature: CloudinarySignature
): Promise<{ url: string; publicId: string; bytes: number }> {
  if (!signature.cloudName || !signature.apiKey) {
    throw new Error("Cloudinary is not configured for direct uploads");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

// Save Cloudinary video URL to database
export async function saveCloudinaryVideo(
  url: string, 
  originalName: string, 
  publicId: string, 
  size: number, 
  token: string
): Promise<{ media: Media }> {
  return http<{ media: Media }>("/api/save-cloudinary-video", {
    method: "POST",
    body: JSON.stringify({ url, originalName, publicId, size }),
    token,
  });
}

async function uploadVideoViaCloudinary(file: File, token: string, signature: CloudinarySignature) {
  const cloudResult = await uploadToCloudinary(file, signature);
  const saveResult = await saveCloudinaryVideo(
    cloudResult.url,
    file.name,
    cloudResult.publicId,
    cloudResult.bytes,
    token
  );

  return saveResult.media;
}

export async function uploadManagedVideoFile(file: File, token: string) {
  let signature: CloudinarySignature | null = null;

  try {
    signature = await getCloudinarySignature(token);
  } catch {
    signature = null;
  }

  if (signature) {
    if (file.size > CLOUDINARY_VIDEO_LIMIT_BYTES) {
      throw new Error(
        `File too large: ${file.name} (${formatFileSize(file.size)} > ${formatFileSize(CLOUDINARY_VIDEO_LIMIT_BYTES)} limit)`
      );
    }

    try {
      const media = await uploadVideoViaCloudinary(file, token, signature);
      return { media, transport: "cloudinary" as const };
    } catch (cloudinaryError) {
      if (file.size > SERVER_VIDEO_LIMIT_BYTES) {
        throw new Error(getErrorMessage(cloudinaryError, "Cloud upload failed"));
      }

      try {
        const res = await uploadVideoFile(file, token);
        return { media: res.media, transport: "server" as const };
      } catch (serverError) {
        throw new Error(
          `Cloud upload failed: ${getErrorMessage(cloudinaryError)}. Server fallback failed: ${getErrorMessage(serverError)}`
        );
      }
    }
  }

  if (file.size > SERVER_VIDEO_LIMIT_BYTES) {
    throw new Error(
      `File too large: ${file.name} (${formatFileSize(file.size)} > ${formatFileSize(SERVER_VIDEO_LIMIT_BYTES)} limit)`
    );
  }

  const res = await uploadVideoFile(file, token);
  return { media: res.media, transport: "server" as const };
}

