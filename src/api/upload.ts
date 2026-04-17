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
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("resource_type", signature.resourceType);

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

