import express from "express";
import UserController from "../controllers/users.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/logout", authenticate, UserController.logout); // Requer autenticação
router.get("/check-auth", authenticate, UserController.checkAuth); // Requer autenticação

export default router;
