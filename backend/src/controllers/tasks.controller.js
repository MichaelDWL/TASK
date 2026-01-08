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

async function finalizarTarefa(req, res) {
  try {
    const { id } = req.params;
    const sucesso = await TaskModel.finalizarTask(id);

    if (!sucesso) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada ou já finalizada" });
    }

    res.status(200).json({ mensagem: "Tarefa finalizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao finalizar tarefa" });
  }
}

async function criarTarefa(req, res) {
  try {
    const { nome_colaborador, descricao, urgencia, setor_id, local_id } =
      req.body;

    // Validação
    if (!nome_colaborador || !nome_colaborador.trim()) {
      return res.status(400).json({
        erro: "Nome do colaborador é obrigatório",
      });
    }

    if (!descricao || !descricao.trim()) {
      return res.status(400).json({
        erro: "Descrição da tarefa é obrigatória",
      });
    }

    // Validar urgência
    const urgenciasValidas = ["alta", "media", "baixa"];
    const urgenciaNormalizada = urgencia ? urgencia.toLowerCase() : "media";

    if (!urgenciasValidas.includes(urgenciaNormalizada)) {
      return res.status(400).json({
        erro: "Urgência inválida. Use: alta, media ou baixa",
      });
    }

    // Criar tarefa
    const taskId = await TaskModel.create({
      nome_colaborador: nome_colaborador.trim(),
      descricao: descricao.trim(),
      urgencia: urgenciaNormalizada,
      setor_id: setor_id || null,
      local_id: local_id || null,
    });

    res.status(201).json({
      mensagem: "Tarefa criada com sucesso",
      id: taskId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
}

export default {
  listarPendentes,
  listarEmExecucao,
  listarConcluidas,
  buscarPorId,
  iniciarTarefa,
  finalizarTarefa,
  criarTarefa,
};
