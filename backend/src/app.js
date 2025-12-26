import express from "express";

const app = express();

// Configurações e rotas...
app.get("/", (req, res) => {
  res.send("Olá Mundo!");
});

export default app; // Exportação padrão
