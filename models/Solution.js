import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    timeframe: { type: String, default: "This Week" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", solutionSchema);
export default Solution;
