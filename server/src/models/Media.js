import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true }, // relative to UPLOAD_DIR
    url: { type: String, required: true }
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", MediaSchema);

