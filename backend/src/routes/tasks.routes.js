import express from "express";
import TaskController from "../controllers/tasks.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rotas GET (devem vir antes das rotas com :id)
router.get("/pendentes", TaskController.listarPendentes);
router.get("/execucao", TaskController.listarEmExecucao);
router.get("/concluidas", TaskController.listarConcluidas);

// Rota POST para criar nova tarefa
router.post("/", TaskController.criarTarefa);

// Rotas com parâmetros
router.get("/:id", TaskController.buscarPorId);
// Rota protegida: requer autenticação para iniciar tarefa
router.put("/:id/iniciar", authenticate, TaskController.iniciarTarefa);
// Rota protegida: requer autenticação para finalizar tarefa
router.put("/:id/finalizar", authenticate, TaskController.finalizarTarefa);

export default router;
