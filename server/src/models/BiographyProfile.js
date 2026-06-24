import mongoose from "mongoose";

const biographyProfileSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    portrait: { type: String, default: "" },
    summary: {
      fr: { type: String, default: "" },
      en: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export const BiographyProfile = mongoose.model("BiographyProfile", biographyProfileSchema);
