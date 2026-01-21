import mongoose from "mongoose";

const poolSchema = new mongoose.Schema(
  {
    token0: String,
    token1: String,
    pairAddress: String,
    reserve0: String,
    reserve1: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pool", poolSchema);
