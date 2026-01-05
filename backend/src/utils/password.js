import bcrypt from "bcrypt";

// número de rounds para gerar o hash (quanto maior, mais seguro, mas mais lento)
const saltRounds = 10;

/**
 * Gera o hash da senha
 * @param {string} password - senha original digitada pelo usuário
 * @returns {Promise<string>} - hash seguro da senha
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara uma senha digitada com o hash salvo no banco
 * @param {string} password - senha digitada
 * @param {string} hashedPassword - hash salvo no banco
 * @returns {Promise<boolean>} - true se bater, false caso contrário
 */

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
