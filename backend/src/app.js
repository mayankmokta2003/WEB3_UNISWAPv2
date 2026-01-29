import express from "express";
import cors from "cors";
import poolRoutes from "./routes/pool.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/pools", poolRoutes);

export default app;
