import pool from "../config/db.js";

/**
 * Busca todos os locais ordenados por nome
 * @returns {Promise<Array>} - Lista de locais
 */
async function findAll() {
  const [rows] = await pool.query(
    "SELECT id, nome FROM locais ORDER BY nome ASC"
  );
  return rows;
}

/**
 * Busca um local por ID
 * @param {number} id - ID do local
 * @returns {Promise<Object|null>} - Local encontrado ou null
 */
async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, nome FROM locais WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

/**
 * Busca um local por nome
 * @param {string} nome - Nome do local
 * @returns {Promise<Object|null>} - Local encontrado ou null
 */
async function findByNome(nome) {
  const [rows] = await pool.query(
    "SELECT id, nome FROM locais WHERE nome = ?",
    [nome]
  );
  return rows[0] || null;
}

/**
 * Cria um novo local
 * @param {string} nome - Nome do local
 * @returns {Promise<number>} - ID do local criado
 */
async function create(nome) {
  const [result] = await pool.query(
    "INSERT INTO locais (nome) VALUES (?)",
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

