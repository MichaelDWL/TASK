import { Router } from "express";
import taskController from "../controllers/tasks.controller.js";

const router = Router();

// GET /tasks
router.get("/", taskController.list);

export default router;
