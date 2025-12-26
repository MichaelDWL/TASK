import pool from "./db.js";

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado ao MySQL com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error.message);
  }
}

testConnection();
