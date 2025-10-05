import mongoose from "mongoose";

const mistakeSchema = new mongoose.Schema(
  {
    task: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    completed: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Mistake = mongoose.model("Mistake", mistakeSchema);
export default Mistake;
