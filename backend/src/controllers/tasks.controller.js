import TaskModel from "../models/task.model.js";

async function listarPendentes(req, res) {
  try {
    const tasks = await TaskModel.findPendente();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas pendentes" });
  }
}

async function listarEmExecucao(req, res) {
  try {
    const tasks = await TaskModel.findExecutando();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas em execução" });
  }
}

async function listarConcluidas(req, res) {
  try {
    const tasks = await TaskModel.findConluidas();
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
