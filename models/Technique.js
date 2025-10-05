import mongoose from "mongoose";

const techniqueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    tips: [{ type: String }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ link to user
      required: true,
    },
  },
  { timestamps: true }
);

const Technique = mongoose.model("Technique", techniqueSchema);

export default Technique;
