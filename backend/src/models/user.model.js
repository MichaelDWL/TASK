// Exemplo de como usar

const pool = require("../config/database");

async function findByLogin(login) {
  const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
    login,
  ]);
  return rows[0];
}

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

module.exports = {
  findByLogin,
  create,
};
