/**
 * Script para criar um usuário de teste no banco de dados
 * Execute: node backend/scripts/create-test-user.js
 */

import pool from "../src/config/db.js";
import { hashPassword } from "../src/utils/password.js";

async function createTestUser() {
  try {
    // Dados do usuário de teste
    const testUser = {
      login: "teste",
      email: "teste@teste.com",
      password: "123456", // Senha em texto plano (será hasheada)
      nome_completo: "Usuário Teste",
      role_id: 1, // Ajuste conforme sua tabela de roles
    };

    // Gerar hash da senha
    const hashedPassword = await hashPassword(testUser.password);

    // Verificar se o usuário já existe
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR login = ?",
      [testUser.email, testUser.login]
    );

    if (existingUser.length > 0) {
      console.log("❌ Usuário já existe no banco de dados!");
      console.log("Email ou login já cadastrado.");
      process.exit(1);
    }

    // Inserir usuário no banco
    const [result] = await pool.query(
      `INSERT INTO users (login, nome_completo, email, senha, role_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        testUser.login,
        testUser.nome_completo,
        testUser.email,
        hashedPassword,
        testUser.role_id,
      ]
    );

    console.log("✅ Usuário de teste criado com sucesso!");
    console.log("\n📋 Credenciais de acesso:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Email/Login: ${testUser.email} ou ${testUser.login}`);
    console.log(`Senha: ${testUser.password}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\nID do usuário criado: ${result.insertId}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar usuário de teste:", error);
    process.exit(1);
  }
}

createTestUser();

