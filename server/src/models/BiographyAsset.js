import mongoose from "mongoose";

const biographyAssetSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, trim: true, index: true },
    kind: { type: String, enum: ["document", "portrait"], required: true },
    lang: { type: String, enum: ["fr", "en"], default: null },
    mimeType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export const BiographyAsset = mongoose.model("BiographyAsset", biographyAssetSchema);
