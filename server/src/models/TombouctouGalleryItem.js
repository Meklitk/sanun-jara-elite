import mongoose from "mongoose";

const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    fr: { type: String, default: "" },
  },
  { _id: false }
);

const TombouctouGalleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: LocalizedStringSchema, default: () => ({}) },
    caption: { type: LocalizedStringSchema, default: () => ({}) },
    altText: { type: LocalizedStringSchema, default: () => ({}) },
    displayOrder: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false },
    size: {
      type: String,
      enum: ["small", "medium", "large", "tall", "wide"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const TombouctouGalleryItem = mongoose.model(
  "TombouctouGalleryItem",
  TombouctouGalleryItemSchema
);
