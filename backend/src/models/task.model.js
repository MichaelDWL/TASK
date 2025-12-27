import pool from "../config/db.js";

async function findPendente() {
  const [rows] = await pool.query(`
    SELECT 
      id,
      nome_colaborador,
      descricao,
      created_at
    FROM tasks
    WHERE status = 'pendente'
    ORDER BY created_at DESC
  `);

  return rows;
}

async function findExecutando() {
  const [rows] = await pool.query(`
    SELECT 
      id,
      nome_colaborador,
      descricao,
      created_at
    FROM tasks
    WHERE status = 'em_execucao'
    ORDER BY created_at DESC
  `);

  return rows;
}

async function findConluidas() {
  const [rows] = await pool.query(`
    SELECT 
      id,
      nome_colaborador,
      descricao,
      created_at
    FROM tasks
    WHERE status = 'concluida'
    ORDER BY created_at DESC
  `);

  return rows;
}

export default {
  findPendente,
  findExecutando,
  findConluidas,
};
