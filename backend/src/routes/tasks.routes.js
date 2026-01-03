import express from "express";
import TaskController from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/pendentes", TaskController.listarPendentes);
router.get("/execucao", TaskController.listarEmExecucao);
router.get("/concluidas", TaskController.listarConcluidas);
router.get("/:id", TaskController.buscarPorId);
router.put("/:id/iniciar", TaskController.iniciarTarefa);

export default router;
