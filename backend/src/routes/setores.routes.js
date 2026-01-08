import express from "express";
import SetorController from "../controllers/setores.controller.js";

const router = express.Router();

router.get("/", SetorController.listarTodos);
router.get("/:id", SetorController.buscarPorId);
router.post("/", SetorController.criarOuBuscar);

export default router;

