/**
 * Sistema simples de controle de tentativas de login em memória
 * Em produção, considere usar Redis ou banco de dados
 */

// Armazenamento em memória (para desenvolvimento)
// Em produção, use Redis ou banco de dados
const loginAttempts = new Map();

const MAX_TENTATIVAS = 5;
const TIMER_BLOCK = 15 * 60 * 1000; // 15 minutos

/**
 * Registra uma tentativa de login falha
 * @param {string} identifier - Email ou login usado na tentativa
 * @returns {Object} - { blocked: boolean, remainingTime?: number }
 */
export function recordFailedAttempt(identifier) {
  const key = identifier.toLowerCase();
  const now = Date.now();

  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, {
      attempts: 0,
      blockedUntil: null,
    });
  }

  const data = loginAttempts.get(key);

  // Se está bloqueado, verificar se ainda está no período
  if (data.blockedUntil && now < data.blockedUntil) {
    const remainingTime = Math.ceil((data.blockedUntil - now) / 1000 / 60);
    return {
      blocked: true,
      remainingTime,
    };
  }

  // Resetar se o bloqueio expirou
  if (data.blockedUntil && now >= data.blockedUntil) {
    data.attempts = 0;
    data.blockedUntil = null;
  }

  // Incrementar tentativas
  data.attempts++;

  // Bloquear se excedeu limite
  if (data.attempts >= MAX_TENTATIVAS) {
    data.blockedUntil = now + TIMER_BLOCK;
    return {
      blocked: true,
      remainingTime: Math.ceil(TIMER_BLOCK / 1000 / 60),
    };
  }

  loginAttempts.set(key, data);

  return {
    blocked: false,
    remainingAttempts: MAX_TENTATIVAS - data.attempts,
  };
}

/**
 * Verifica se um identificador está bloqueado
 * @param {string} identifier - Email ou login
 * @returns {Object} - { blocked: boolean, remainingTime?: number }
 */
export function isBlocked(identifier) {
  const key = identifier.toLowerCase();
  const now = Date.now();

  if (!loginAttempts.has(key)) {
    return { blocked: false };
  }

  const data = loginAttempts.get(key);

  if (!data.blockedUntil) {
    return { blocked: false };
  }

  if (now < data.blockedUntil) {
    const remainingTime = Math.ceil((data.blockedUntil - now) / 1000 / 60);
    return {
      blocked: true,
      remainingTime,
    };
  }

  // Bloqueio expirado, limpar
  loginAttempts.delete(key);
  return { blocked: false };
}

/**
 * Limpa tentativas após login bem-sucedido
 * @param {string} identifier - Email ou login
 */
export function clearAttempts(identifier) {
  const key = identifier.toLowerCase();
  loginAttempts.delete(key);
}

/**
 * Limpa todas as tentativas (útil para testes)
 */
export function clearAllAttempts() {
  loginAttempts.clear();
}

