import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "identity_documents",
        "welfare_schemes",
        "permits_licenses",
        "utilities",
        "taxes",
        "other",
      ],
      required: true,
    },
    howToApply: { type: String, required: true },
    link: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

serviceSchema.index({ title: "text", description: "text" });

export default mongoose.model("Service", serviceSchema);
