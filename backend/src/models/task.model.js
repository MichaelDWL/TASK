import pool from "../config/db.js";

async function findAll() {
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

export default {
  findAll,
};
