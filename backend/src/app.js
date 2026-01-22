import express from "express";
import cors from "cors";
// import healthRoutes from "./routes/health.route.js";
import poolRoutes from "./routes/pool.route.js";

const app = express();

app.use(cors());
app.use(express.json());
// app.use("/api/health", healthRoutes);
app.use("/api/pools", poolRoutes);

export default app;