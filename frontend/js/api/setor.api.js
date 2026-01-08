// Camada API: todas as chamadas HTTP relacionadas a setores ficam aqui.

const BASE_URL = "http://localhost:3000/setores";

async function parseJsonSafe(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      (data && (data.message || data.erro)) ||
      `Erro HTTP ${response.status} (${response.statusText})`;
    throw new Error(message);
  }

  return data;
}

/**
 * Busca todos os setores
 * @returns {Promise<Array>} - Lista de setores
 */
export async function fetchSetores() {
  return await request(`${BASE_URL}/`, {
    method: "GET",
  });
}

/**
 * Cria ou busca um setor por nome
 * @param {string} nome - Nome do setor
 * @returns {Promise<Object>} - Setor encontrado ou criado
 */
export async function criarOuBuscarSetor(nome) {
  return await request(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
}

