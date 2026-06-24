import mongoose from "mongoose";

const biographyAssetTombstoneSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    deletedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export const BiographyAssetTombstone = mongoose.model(
  "BiographyAssetTombstone",
  biographyAssetTombstoneSchema,
);
