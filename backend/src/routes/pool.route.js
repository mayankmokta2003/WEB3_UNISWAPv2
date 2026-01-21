import { Router } from "express";
import { syncPool, getPools } from "../controllers/pool.controller";

const router = Router();

router.post("/sync", syncPool);
router.get("/", getPools);

export default router;