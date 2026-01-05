import pool from "../config/db.js";

/**
 * Busca um usuário por email
 * @param {string} email - Email do usuário
 * @returns {Promise<Object|null>} - Usuário encontrado ou null
 */
async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, email, senha, nome_completo, login FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

/**
 * Busca um usuário por login
 * @param {string} login - Login do usuário
 * @returns {Promise<Object|null>} - Usuário encontrado ou null
 */
async function findByLogin(login) {
  const [rows] = await pool.query(
    "SELECT id, email, senha, nome_completo, login FROM users WHERE login = ?",
    [login]
  );
  return rows[0] || null;
}

/**
 * Cria um novo usuário
 * @param {Object} user - Dados do usuário
 * @returns {Promise<number>} - ID do usuário criado
 */
async function create(user) {
  const { login, nome_completo, email, senha, role_id } = user;

  const [result] = await pool.query(
    `INSERT INTO users 
     (login, nome_completo, email, senha, role_id)
     VALUES (?, ?, ?, ?, ?)`,
    [login, nome_completo, email, senha, role_id]
  );

  return result.insertId;
}

export default {
  findByEmail,
  findByLogin,
  create,
};
