import pool from "../config/db.js";

async function findById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      tasks.id,
      tasks.nome_colaborador,
      tasks.usuario_executor_id,
      users.nome_completo AS usuario_executor,
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.status,
      tasks.setor_id,
      setores.nome AS setor,
      tasks.local_id,
      locais.nome AS local
    FROM tasks
    LEFT JOIN setores ON tasks.setor_id = setores.id
    LEFT JOIN locais ON tasks.local_id = locais.id
    LEFT JOIN users ON tasks.usuario_executor_id = users.id
    WHERE tasks.id = ?
  `,
    [id]
  );

  return rows[0] || null;
}

async function iniciarTask(id, usuarioExecutorId) {
  const [result] = await pool.query(
    `
    UPDATE tasks 
    SET status = 'em_execucao', 
        inicio_execucao = NOW(),
        usuario_executor_id = ?
    WHERE id = ? AND status = 'pendente'
  `,
    [usuarioExecutorId, id]
  );

  return result.affectedRows > 0;
}

async function finalizarTask(id) {
  const [result] = await pool.query(
    `
    UPDATE tasks 
    SET status = 'concluida', 
        fim_execucao = NOW()
    WHERE id = ? AND status = 'em_execucao'
  `,
    [id]
  );

  return result.affectedRows > 0;
}

// Função auxiliar para construir ORDER BY
function buildOrderBy(sortBy = "data-desc") {
  const [field, direction] = sortBy.split("-");
  const directionUpper = direction.toUpperCase();

  const orderMap = {
    data: "tasks.created_at",
    nome: "tasks.nome_colaborador",
    descricao: "tasks.descricao",
    setor: "setores.nome",
    urgencia: "tasks.urgencia",
  };

  const orderField = orderMap[field] || "tasks.created_at";

  // Para urgência, usar ordenação customizada (alta, média, baixa)
  if (field === "urgencia") {
    // Inverter a lógica: desc (Alta → Baixa) usa ASC, asc (Baixa → Alta) usa DESC
    const orderDir = directionUpper === "DESC" ? "ASC" : "DESC";
    // Ordenação customizada: alta=1, média=2, baixa=3
    return `ORDER BY 
      CASE tasks.urgencia 
        WHEN 'alta' THEN 1 
        WHEN 'media' THEN 2 
        WHEN 'baixa' THEN 3 
        ELSE 4 
      END ${orderDir}`;
  }

  const orderDir = directionUpper === "ASC" ? "ASC" : "DESC";
  return `ORDER BY ${orderField} ${orderDir}`;
}

async function findPendente(sortBy = "data-desc") {
  const orderBy = buildOrderBy(sortBy);

  const [rows] = await pool.query(`
    SELECT 
      tasks.id,
      tasks.nome_colaborador,
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.setor_id,
      setores.nome AS setor
    FROM tasks
    LEFT JOIN setores ON tasks.setor_id = setores.id
    WHERE tasks.status = 'pendente'
    ${orderBy}
  `);

  return rows;
}

async function findExecutando(sortBy = "data-desc") {
  const orderBy = buildOrderBy(sortBy);

  const [rows] = await pool.query(`
    SELECT 
      tasks.id,
      tasks.nome_colaborador,
      tasks.usuario_executor_id,
      users.nome_completo AS usuario_executor,
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.setor_id,
      setores.nome AS setor
    FROM tasks
    LEFT JOIN users ON tasks.usuario_executor_id = users.id
    LEFT JOIN setores ON tasks.setor_id = setores.id
    WHERE tasks.status = 'em_execucao'
    ${orderBy}
  `);

  return rows;
}

async function findConluidas(sortBy = "data-desc") {
  const orderBy = buildOrderBy(sortBy);

  const [rows] = await pool.query(`
    SELECT 
      tasks.id,
      tasks.nome_colaborador,
      tasks.usuario_executor_id,
      users.nome_completo AS usuario_executor,
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.setor_id,
      setores.nome AS setor
    FROM tasks
    LEFT JOIN users ON tasks.usuario_executor_id = users.id
    LEFT JOIN setores ON tasks.setor_id = setores.id
    WHERE tasks.status = 'concluida'
    ${orderBy}
  `);

  return rows;
}

/**
 * Cria uma nova tarefa
 * @param {Object} taskData - Dados da tarefa
 * @returns {Promise<number>} - ID da tarefa criada
 */
async function create(taskData) {
  const {
    nome_colaborador,
    descricao,
    urgencia = "media",
    setor_id = null,
    local_id = null,
  } = taskData;

  const [result] = await pool.query(
    `INSERT INTO tasks 
     (nome_colaborador, descricao, urgencia, status, setor_id, local_id, created_at)
     VALUES (?, ?, ?, 'pendente', ?, ?, NOW())`,
    [nome_colaborador, descricao, urgencia, setor_id, local_id]
  );

  return result.insertId;
}

export default {
  findPendente,
  findExecutando,
  findConluidas,
  findById,
  iniciarTask,
  finalizarTask,
  create,
};
