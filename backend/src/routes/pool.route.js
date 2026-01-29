import { Router } from "express";
import { getAllPools } from "../controllers/pool.controller.js";

const router = Router();

router.get("/", getAllPools);

export default router;
