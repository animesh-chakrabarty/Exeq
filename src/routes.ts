import { Router } from "express";
import { controllers } from "./controllers.js"

const router = Router();

router.post("/execute", controllers.executeCode);
router.get("/check", controllers.checkExecutionStatus);

export default router;