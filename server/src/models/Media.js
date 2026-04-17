import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: String, required: true }, // base64 encoded image data
    url: { type: String, required: true }   // data URI or API endpoint
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", MediaSchema);

