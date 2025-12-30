import { formatDate } from "../utils/formatDate.js";

const API_URL = "http://localhost:3000/tasks";

// função genérica
async function carregarPorStatus(endpoint, containerId) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    const tasks = await response.json();

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    tasks.forEach((task) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3 class="font-m-t">${task.nome_colaborador}</h3>
        <p class="font-m-desc">${task.descricao}</p>

        <div class="task-footer">
          <span class="times">
            ${formatDate(task.created_at)}
          </span>

          ${
            endpoint === "pendentes"
              ? `<button class="button-1" data-id="${task.id}">Iniciar</button>`
              : ""
          }
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error(`Erro ao carregar tasks ${endpoint}`, error);
  }
}

// funções específicas (mais legível)
export function carregarPendentes() {
  carregarPorStatus("pendentes", "tasks-pendentes");
}

export function carregarEmExecucao() {
  carregarPorStatus("execucao", "tasks-execucao");
}

export function carregarConcluidas() {
  carregarPorStatus("concluidas", "tasks-concluidas");
}
