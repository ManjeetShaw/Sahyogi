import mongoose from "mongoose";

// Lets a citizen bookmark a government service to find it again later
// from their dashboard.
const savedServiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  },
  { timestamps: true }
);

savedServiceSchema.index({ user: 1, service: 1 }, { unique: true });

export default mongoose.model("SavedService", savedServiceSchema);
