import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    content: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    icon: { type: String, default: "FileText" },
    order: { type: Number, default: 0 },
    images: [{ type: String }],
    links: [
      {
        label: {
          en: { type: String, default: "" },
          fr: { type: String, default: "" }
        },
        url: { type: String, default: "" }
      }
    ],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", ContentSchema);
