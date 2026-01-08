import express from "express";
import TaskController from "../controllers/tasks.controller.js";

const router = express.Router();

// Rotas GET (devem vir antes das rotas com :id)
router.get("/pendentes", TaskController.listarPendentes);
router.get("/execucao", TaskController.listarEmExecucao);
router.get("/concluidas", TaskController.listarConcluidas);

// Rota POST para criar nova tarefa
router.post("/", TaskController.criarTarefa);

// Rotas com parâmetros
router.get("/:id", TaskController.buscarPorId);
router.put("/:id/iniciar", TaskController.iniciarTarefa);
router.put("/:id/finalizar", TaskController.finalizarTarefa);

export default router;
