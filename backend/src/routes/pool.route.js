import { Router } from "express";
import { getAllPools } from "../controllers/pool.controller.js";

const router = Router();

// router.post("/sync", syncPool);
// router.get("/", getPools);

router.get("/", getAllPools);

export default router;