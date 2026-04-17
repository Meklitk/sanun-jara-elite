import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: String, required: false }, // base64 encoded image data (null for videos)
    url: { type: String, required: true },   // data URI, API endpoint, or Cloudinary URL
    cloudinaryPublicId: { type: String, required: false } // Cloudinary public ID for video management
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", MediaSchema);

