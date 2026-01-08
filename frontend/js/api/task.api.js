// Camada API: todas as chamadas HTTP relacionadas a tarefas ficam aqui.
// A camada de UI deve apenas importar estas funções e renderizar os dados.

const BASE_URL = "http://localhost:3000/tasks";

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
      (data && (data.erro || data.message)) ||
      `Erro HTTP ${response.status} (${response.statusText})`;
    throw new Error(message);
  }

  return data;
}

// Buscar lista de tasks por status com suporte a ordenação (sortBy)
export async function fetchTasksByStatus(statusEndpoint, sortBy = "data-desc") {
  const sortParam = encodeURIComponent(sortBy || "data-desc");
  const url = `${BASE_URL}/${statusEndpoint}?sortBy=${sortParam}`;
  return await request(url);
}

// Buscar uma task por ID
export async function fetchTaskById(taskId) {
  const url = `${BASE_URL}/${taskId}`;
  return await request(url);
}

// Iniciar task (muda status para em_execucao) - Requer autenticação
export async function iniciarTask(taskId) {
  const url = `${BASE_URL}/${taskId}/iniciar`;
  return await request(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Incluir cookies (token httpOnly)
  });
}

// Finalizar task (muda status para concluida) - Requer autenticação
export async function finalizarTask(taskId) {
  const url = `${BASE_URL}/${taskId}/finalizar`;
  return await request(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Incluir cookies (token httpOnly)
  });
}

/**
 * Cria uma nova tarefa
 * @param {Object} taskData - Dados da tarefa
 * @returns {Promise<Object>} - Tarefa criada
 */
export async function criarTask(taskData) {
  return await request(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
}
