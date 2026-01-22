import mongoose from "mongoose";

const poolSchema = new mongoose.Schema(
  {
    token0: { type: String, required: true },
    token1: { type: String, required: true },

    pairAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reserve0: { type: String, default: "0" },
    reserve1: { type: String, default: "0" },

    volumeToken0: { type: Number, default: "0" },
    volumeToken1: { type: Number, default: "0" },
  },
  { timestamps: true }
);

export default mongoose.model("Pool", poolSchema);

