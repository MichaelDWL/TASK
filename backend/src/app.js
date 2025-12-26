import express from "express";
import taskRoutes from "./routes/tasks.routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  res.send("API TASK funcionando 🚀");
});

// rotas de task
app.use("/tasks", taskRoutes);

export default app;
