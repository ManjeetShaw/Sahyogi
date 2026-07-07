import mongoose from "mongoose";

// Stores a lightweight log of AI companion exchanges, useful for
// improving answers and for a user's own chat history. No sensitive
// government ID numbers should ever be logged here.
const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    reply: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
