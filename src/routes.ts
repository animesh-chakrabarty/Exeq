import { Router } from "express";
import { controllers } from "./controllers.js"

const router = Router();

router.post("/execute", controllers.executeCode);
router.get("/health", controllers.healthCheck)
// router.get("/check", controllers.checkExecutionStatus);

export default router;