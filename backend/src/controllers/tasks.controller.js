import TaskModel from "../models/task.model.js";

async function listarPendentes(req, res) {
  try {
    const sortBy = req.query.sortBy || "data-desc";
    const tasks = await TaskModel.findPendente(sortBy);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas pendentes" });
  }
}

async function listarEmExecucao(req, res) {
  try {
    const sortBy = req.query.sortBy || "data-desc";
    const tasks = await TaskModel.findExecutando(sortBy);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas em execução" });
  }
}

async function listarConcluidas(req, res) {
  try {
    const sortBy = req.query.sortBy || "data-desc";
    const tasks = await TaskModel.findConluidas(sortBy);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas concluídas" });
  }
}

export default {
  listarPendentes,
  listarEmExecucao,
  listarConcluidas,
};
