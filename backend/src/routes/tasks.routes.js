import express from "express";
import TaskController from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/pendentes", TaskController.listarPendentes);
router.get("/execucao", TaskController.listarEmExecucao);
router.get("/concluidas", TaskController.listarConcluidas);
router.get("/:id", TaskController.buscarPorId);
router.put("/:id/iniciar", TaskController.iniciarTarefa);
router.put("/:id/finalizar", TaskController.finalizarTarefa);

export default router;
