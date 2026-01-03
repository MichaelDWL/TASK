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

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
}

async function iniciarTarefa(req, res) {
  try {
    const { id } = req.params;
    const sucesso = await TaskModel.iniciarTask(id);

    if (!sucesso) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada ou já iniciada" });
    }

    res.status(200).json({ mensagem: "Tarefa iniciada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao iniciar tarefa" });
  }
}

export default {
  listarPendentes,
  listarEmExecucao,
  listarConcluidas,
  buscarPorId,
  iniciarTarefa,
};
