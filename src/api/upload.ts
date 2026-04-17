import { http } from "./http";

export type Media = {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
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

