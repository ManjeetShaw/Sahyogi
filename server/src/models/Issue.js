import mongoose from "mongoose";

const ISSUE_CATEGORIES = [
  "roads",
  "sanitation",
  "water_supply",
  "electricity",
  "public_safety",
  "parks",
  "other",
];

const ISSUE_STATUSES = ["submitted", "in_review", "in_progress", "resolved"];

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, maxlength: 2000 },
    category: { type: String, enum: ISSUE_CATEGORIES, required: true },
    status: { type: String, enum: ISSUE_STATUSES, default: "submitted" },
    location: {
      address: { type: String, trim: true },
      lat: Number,
      lng: Number,
    },
    imageUrl: { type: String, trim: true },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    statusHistory: [
      {
        status: { type: String, enum: ISSUE_STATUSES },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

issueSchema.index({ category: 1, status: 1 });

export { ISSUE_CATEGORIES, ISSUE_STATUSES };
export default mongoose.model("Issue", issueSchema);
