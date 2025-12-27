import express from "express";
import TaskController from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/pendentes", TaskController.listarPendentes);
router.get("/execucao", TaskController.listarEmExecucao);
router.get("/concluidas", TaskController.listarConcluidas);

export default router;
