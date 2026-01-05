// Camada API: todas as chamadas HTTP relacionadas a usuários ficam aqui.

const BASE_URL = "http://localhost:3000/users";

async function parseJsonSafe(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

async function request(url, options = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // IMPORTANTE: Envia cookies automaticamente
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
      const message =
        (data && (data.message || data.erro)) ||
        `Erro HTTP ${response.status} (${response.statusText})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    // Se for erro de rede (failed to fetch)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique se o servidor está rodando na porta 3000."
      );
    }
    throw error;
  }
}

/**
 * Faz login do usuário
 * Token é salvo automaticamente em cookie httpOnly pelo servidor
 * @param {string} login - Email ou login do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} - Dados do usuário logado
 */
export async function login(login, password) {
  // Login não precisa de token, apenas envia credenciais
  // O servidor retorna o token em um cookie httpOnly
  return await request(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
}

/**
 * Faz logout do usuário
 * Remove o cookie de autenticação
 * @returns {Promise<Object>} - Confirmação de logout
 */
export async function logout() {
  return await request(`${BASE_URL}/logout`, {
    method: "POST",
  });
}

/**
 * Verifica se o usuário está autenticado
 * @returns {Promise<Object>} - Status de autenticação e dados do usuário
 */
export async function checkAuth() {
  return await request(`${BASE_URL}/check-auth`, {
    method: "GET",
  });
}

