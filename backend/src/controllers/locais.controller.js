import LocalModel from "../models/local.model.js";

/**
 * Lista todos os locais
 */
async function listarTodos(req, res) {
  try {
    const locais = await LocalModel.findAll();
    res.status(200).json(locais);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar locais" });
  }
}

/**
 * Busca um local por ID
 */
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const local = await LocalModel.findById(id);

    if (!local) {
      return res.status(404).json({ erro: "Local não encontrado" });
    }

    res.status(200).json(local);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar local" });
  }
}

/**
 * Cria um novo local (se não existir, retorna o existente)
 */
async function criarOuBuscar(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: "Nome do local é obrigatório" });
    }

    // Verificar se já existe
    let local = await LocalModel.findByNome(nome.trim());

    if (!local) {
      // Criar novo local
      const id = await LocalModel.create(nome.trim());
      local = await LocalModel.findById(id);
    }

    res.status(200).json(local);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar/buscar local" });
  }
}

export default {
  listarTodos,
  buscarPorId,
  criarOuBuscar,
};

