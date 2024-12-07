import { Router } from "express";
import { controllers } from "./controllers.js"

const router = Router();

router.post("/execute", controllers.executeCode);
router.get("/health", controllers.healthCheck)

export default router;