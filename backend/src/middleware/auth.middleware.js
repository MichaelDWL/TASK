import { extractTokenFromHeader, verifyToken } from "../utils/jwt.js";

/**
 * Middleware para verificar autenticação JWT
 * Adiciona req.user com os dados do usuário autenticado
 * Busca token no cookie ou no header Authorization
 */
export function authenticate(req, res, next) {
  try {
    // Tentar extrair token do cookie primeiro (mais seguro)
    let token = req.cookies?.authToken;

    // Se não tiver no cookie, tentar no header Authorization (fallback)
    if (!token) {
      token = extractTokenFromHeader(req);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
    }

    // Verificar e decodificar token
    const decoded = verifyToken(token);

    // Adicionar dados do usuário na request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      login: decoded.login,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Token inválido ou expirado",
    });
  }
}

/**
 * Middleware opcional - verifica autenticação mas não bloqueia
 * Útil para rotas que funcionam com ou sem autenticação
 */
export function optionalAuthenticate(req, res, next) {
  try {
    // Tentar cookie primeiro
    let token = req.cookies?.authToken;
    if (!token) {
      token = extractTokenFromHeader(req);
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        login: decoded.login,
      };
    }
    next();
  } catch (error) {
    // Se token inválido, continua sem autenticação
    next();
  }
}

