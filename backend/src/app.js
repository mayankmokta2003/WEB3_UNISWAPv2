import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.route.js";
import poolRoutes from "./routes/pool.route.js";
// import swapRoutes from "./routes/swap.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/health", healthRoutes);
// app.use("/api/pools", poolRoutes);
// app.use("/api/swaps", swapRoutes);
app.use("/api/pools", poolRoutes);

export default app;