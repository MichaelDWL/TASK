import pool from "../config/db.js";

async function findById(id) {
  const [rows] = await pool.query(
    `
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
    WHERE tasks.id = ?
  `,
    [id]
  );

  return rows[0] || null;
}

async function iniciarTask(id) {
  const [result] = await pool.query(
    `
    UPDATE tasks 
    SET status = 'em_execucao', 
        inicio_execucao = NOW()
    WHERE id = ? AND status = 'pendente'
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
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.setor_id,
      setores.nome AS setor
    FROM tasks
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
      tasks.descricao,
      tasks.created_at,
      tasks.urgencia,
      tasks.setor_id,
      setores.nome AS setor
    FROM tasks
    LEFT JOIN setores ON tasks.setor_id = setores.id
    WHERE tasks.status = 'concluida'
    ${orderBy}
  `);

  return rows;
}

export default {
  findPendente,
  findExecutando,
  findConluidas,
  findById,
  iniciarTask,
};
