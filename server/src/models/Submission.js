import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["membership", "question"] },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    profession: { type: String, required: false }, // only for membership
    message: { type: String, required: false },   // for simple questions
    answers: { type: mongoose.Schema.Types.Mixed, required: false }, // for the 17 fixed questions in membership
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
