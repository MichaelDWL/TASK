import UserModel from "../models/user.model.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import {
  recordFailedAttempt,
  isBlocked,
  clearAttempts,
} from "../utils/loginAttempts.js";

/**
 * Controller para fazer login
 */
async function login(req, res) {
  const { login, password } = req.body;

  // Validação básica
  if (!login || !password) {
    return res.status(400).json({
      success: false,
      message: "Login e senha são obrigatórios",
    });
  }

  // Verificar se está bloqueado
  const blocked = isBlocked(login);
  if (blocked.blocked) {
    return res.status(403).json({
      success: false,
      message: `Usuário bloqueado. Tente novamente em ${blocked.remainingTime} minuto(s).`,
    });
  }

  try {
    // Buscar usuário por email ou login (tenta ambos)
    let user = await UserModel.findByEmail(login);
    if (!user) {
      user = await UserModel.findByLogin(login);
    }

    if (!user) {
      const result = recordFailedAttempt(login);
      
      if (result.blocked) {
        return res.status(403).json({
          success: false,
          message: `Número máximo de tentativas excedido. Acesso bloqueado por ${result.remainingTime} minutos.`,
        });
      }

      return res.status(401).json({
        success: false,
        message: "Usuário ou senha inválidos",
      });
    }

    // Validar a senha
    const isPasswordValid = await comparePassword(password, user.senha);

    if (!isPasswordValid) {
      const result = recordFailedAttempt(login);
      
      if (result.blocked) {
        return res.status(403).json({
          success: false,
          message: `Número máximo de tentativas excedido. Acesso bloqueado por ${result.remainingTime} minutos.`,
        });
      }

      return res.status(401).json({
        success: false,
        message: "Usuário ou senha inválidos",
      });
    }

    // Login válido — limpa tentativas e gera token JWT
    clearAttempts(login);

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      login: user.login,
    });

    // Configurar cookie com o token
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = 4 * 60 * 60 * 1000; // 4 horas em milissegundos

    res.cookie("authToken", token, {
      httpOnly: true, // Protegido contra JavaScript
      secure: isProduction, // true em HTTPS, false em HTTP (desenvolvimento)
      sameSite: "strict", // Proteção contra CSRF
      maxAge: maxAge, // 4 horas
      path: "/", // Disponível em todas as rotas
    });

    return res.status(200).json({
      success: true,
      message: "Login bem sucedido!",
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome_completo || user.login,
        login: user.login,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor",
    });
  }
}

/**
 * Controller para fazer logout
 * Remove o cookie de autenticação
 */
async function logout(req, res) {
  // Remover cookie de autenticação
  const isProduction = process.env.NODE_ENV === "production";
  
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout realizado com sucesso",
  });
}

/**
 * Controller para verificar se o usuário está autenticado
 * Requer middleware authenticate
 */
async function checkAuth(req, res) {
  // Se chegou aqui, o middleware authenticate já validou o token
  // req.user contém os dados do usuário
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      login: req.user.login,
    },
  });
}

export default {
  login,
  logout,
  checkAuth,
};
