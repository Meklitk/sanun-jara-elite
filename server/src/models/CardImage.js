import mongoose from "mongoose";

const cardImageSchema = new mongoose.Schema(
  {
    slot: { type: String, required: true, unique: true, trim: true },
    url: { type: String, required: true, trim: true },
    cloudinaryPublicId: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

export const CardImage = mongoose.model("CardImage", cardImageSchema);
