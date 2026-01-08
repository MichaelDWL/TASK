import express from "express";
import taskRoutes from "./routes/tasks.routes.js";
import userRoutes from "./routes/users.routes.js";
import setorRoutes from "./routes/setores.routes.js";
import localRoutes from "./routes/locais.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// Session removido - agora usando JWT
// import session from "express-session";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (ex: Postman, mobile apps)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "https://mdwl.com.br",
      ];

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Session removido - agora usando JWT
// Mantido apenas para compatibilidade se necessário
// app.use(session({ ... })); // Removido - usando JWT

// rota de teste
app.get("/", (req, res) => {
  res.send("API TASK funcionando 🚀");
});

// rotas de task
app.use("/tasks", taskRoutes);

// rotas de user
app.use("/users", userRoutes);

// rotas de setores
app.use("/setores", setorRoutes);

// rotas de locais
app.use("/locais", localRoutes);

export default app;
