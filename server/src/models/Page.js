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
    },
    notes: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    image: { type: String, default: "" },
    url: { type: String, default: "" }
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
    },
    url: { type: String, default: "" }
  },
  { _id: false }
);

const GovernanceSchema = new mongoose.Schema(
  {
    chiefdom: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    chiefdomUrl: { type: String, default: "" },
    mandenMansa: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenMansaUrl: { type: String, default: "" },
    mandenDjeliba: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenDjelibaUrl: { type: String, default: "" },
    mandenMory: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    mandenMoryUrl: { type: String, default: "" },
    governmentName: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    governmentNameUrl: { type: String, default: "" },
    constitution: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    constitutionUrl: { type: String, default: "" },
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

const DirectoryItemSchema = new mongoose.Schema(
  {
    name: {
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

const DirectorySchema = new mongoose.Schema(
  {
    countries: [DirectoryItemSchema],
    organizations: [DirectoryItemSchema]
  },
  { _id: false }
);

const UtilityCardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    description: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    url: { type: String, default: "" }
  },
  { _id: false }
);

const EconomyTableRowSchema = new mongoose.Schema(
  {
    label: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    value: {
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

const EconomyTableSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    description: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    rows: [EconomyTableRowSchema]
  },
  { _id: false }
);

const EconomySchema = new mongoose.Schema(
  {
    currencyInfo: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    bankInfo: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    transferServices: EconomyTableSchema,
    recommendationLetters: EconomyTableSchema,
    duesSystem: EconomyTableSchema
  },
  { _id: false }
);

const InstitutionItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    description: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    images: [{ type: String }],
    videos: [{ type: String }]
  },
  { _id: false }
);

const ArchitecturalProjectItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    description: {
      en: { type: String, default: "" },
      fr: { type: String, default: "" }
    },
    conceptImages: [{ type: String }],
    workImages: [{ type: String }]
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
    media: [MediaItemSchema],
    directory: DirectorySchema,
    economy: EconomySchema,
    utilityCards: [UtilityCardSchema],
    institutions: [InstitutionItemSchema],
    architecturalProjects: [ArchitecturalProjectItemSchema],
    featuredImage: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Page = mongoose.model("Page", PageSchema);
