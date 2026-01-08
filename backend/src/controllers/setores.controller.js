import SetorModel from "../models/setor.model.js";

/**
 * Lista todos os setores
 */
async function listarTodos(req, res) {
  try {
    const setores = await SetorModel.findAll();
    res.status(200).json(setores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar setores" });
  }
}

/**
 * Busca um setor por ID
 */
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const setor = await SetorModel.findById(id);

    if (!setor) {
      return res.status(404).json({ erro: "Setor não encontrado" });
    }

    res.status(200).json(setor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar setor" });
  }
}

/**
 * Cria um novo setor (se não existir, retorna o existente)
 */
async function criarOuBuscar(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: "Nome do setor é obrigatório" });
    }

    // Verificar se já existe
    let setor = await SetorModel.findByNome(nome.trim());

    if (!setor) {
      // Criar novo setor
      const id = await SetorModel.create(nome.trim());
      setor = await SetorModel.findById(id);
    }

    res.status(200).json(setor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar/buscar setor" });
  }
}

export default {
  listarTodos,
  buscarPorId,
  criarOuBuscar,
};

