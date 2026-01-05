import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Chave secreta para assinar tokens (use uma chave forte em produção)
const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-super-forte-aqui-mude-em-producao-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "4h"; // 4 horas por padrão

/**
 * Gera um token JWT para o usuário
 * @param {Object} payload - Dados do usuário (userId, email, etc)
 * @returns {string} - Token JWT
 */
export function generateToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      login: payload.login,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "task-manager-api",
    }
  );
}

/**
 * Verifica e decodifica um token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} - Dados decodificados ou null se inválido
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    }
    throw error;
  }
}

/**
 * Extrai o token do header Authorization
 * @param {Object} req - Request do Express
 * @returns {string|null} - Token ou null
 */
export function extractTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  // Formato: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

