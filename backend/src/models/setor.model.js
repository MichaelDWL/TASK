import pool from "../config/db.js";

/**
 * Busca todos os setores ordenados por nome
 * @returns {Promise<Array>} - Lista de setores
 */
async function findAll() {
  const [rows] = await pool.query(
    "SELECT id, nome FROM setores ORDER BY nome ASC"
  );
  return rows;
}

/**
 * Busca um setor por ID
 * @param {number} id - ID do setor
 * @returns {Promise<Object|null>} - Setor encontrado ou null
 */
async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, nome FROM setores WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

/**
 * Busca um setor por nome
 * @param {string} nome - Nome do setor
 * @returns {Promise<Object|null>} - Setor encontrado ou null
 */
async function findByNome(nome) {
  const [rows] = await pool.query(
    "SELECT id, nome FROM setores WHERE nome = ?",
    [nome]
  );
  return rows[0] || null;
}

/**
 * Cria um novo setor
 * @param {string} nome - Nome do setor
 * @returns {Promise<number>} - ID do setor criado
 */
async function create(nome) {
  const [result] = await pool.query(
    "INSERT INTO setores (nome) VALUES (?)",
    [nome]
  );
  return result.insertId;
}

export default {
  findAll,
  findById,
  findByNome,
  create,
};

