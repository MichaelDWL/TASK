import express from "express";
import LocalController from "../controllers/locais.controller.js";

const router = express.Router();

router.get("/", LocalController.listarTodos);
router.get("/:id", LocalController.buscarPorId);
router.post("/", LocalController.criarOuBuscar);

export default router;

