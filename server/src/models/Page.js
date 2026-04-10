import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    label: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    url: { type: String, default: "" }
  },
  { _id: false }
);

const MediaItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, default: "" },
    type: { type: String, enum: ["video", "audio", "document"], required: true },
    category: { type: String, enum: ["djelis", "donsos", "journalists", "other"], default: "other" }
  },
  { _id: false }
);

const TimelineItemSchema = new mongoose.Schema(
  {
    year: { type: String, default: "" },
    title: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    description: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    }
  },
  { _id: false }
);

const GovernanceBranchSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    powers: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    selection: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    }
  },
  { _id: false }
);

const GovernanceSchema = new mongoose.Schema(
  {
    chiefdom: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenMansa: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenDjeliba: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenMory: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    governmentName: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    constitution: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    governmentType: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    corruptionIndex: { type: String, default: "" },
    corruptionSummary: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    riskIndex: { type: String, default: "" },
    riskSummary: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    taxInformation: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    branches: [GovernanceBranchSchema],
    phone: { type: String, default: "" }
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true }, // introduction, history...
    title: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    content: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    images: [{ type: String }],
    links: [LinkSchema],
    timeline: [TimelineItemSchema],
    governance: GovernanceSchema,
    media: [MediaItemSchema]
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", PageSchema);

