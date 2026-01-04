import { formatDate } from "../utils/formatDate.js";
import { openModal, openConfirmFinalizar } from "./modal.ui.js";
import { fetchTaskById, fetchTasksByStatus } from "../api/task.api.js";

// Armazenar ordenação atual para cada coluna
const currentSort = {
  pendentes: "data-desc",
  execucao: "data-desc",
  concluidas: "data-desc",
};

// Função para normalizar e formatar urgência
function formatarUrgencia(urgencia) {
  if (!urgencia) return null;

  const urgenciaLower = urgencia.toLowerCase().trim();

  // Normalizar diferentes formatos
  if (urgenciaLower === "urgente" || urgenciaLower === "alta") {
    return { texto: "Urgente", classe: "urgencia-alta" };
  } else if (urgenciaLower === "media" || urgenciaLower === "média") {
    return { texto: "Média", classe: "urgencia-media" };
  } else if (urgenciaLower === "baixa") {
    return { texto: "Baixa", classe: "urgencia-baixa" };
  }

  return null;
}

// função genérica com suporte a ordenação
async function carregarPorStatus(endpoint, containerId, sortBy = "data-desc") {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Aplicar fade-out antes de limpar (igual ao filtro)
    const cards = container.querySelectorAll(".card");
    if (cards.length > 0) {
      cards.forEach((card) => {
        card.classList.remove("fade-in");
        card.classList.add("fade-out");
      });
    }

    // Aguardar animação de fade-out antes de limpar
    setTimeout(async () => {
      try {
        const tasks = await fetchTasksByStatus(endpoint, sortBy);

        if (!container) return; // Verificar novamente se o container existe

        container.innerHTML = "";

        if (!tasks || tasks.length === 0) {
          container.innerHTML =
            '<p class="font-m-desc" style="text-align: center; padding: 20px; color: #666;">Nenhuma tarefa encontrada</p>';
          return;
        }

        tasks.forEach((task) => {
          const card = document.createElement("div");
          card.classList.add("card", "fade-out");

          // Formatar urgência (apenas para pendentes e execucao)
          const mostrarUrgencia =
            endpoint === "pendentes" || endpoint === "execucao";
          const urgenciaInfo = mostrarUrgencia
            ? formatarUrgencia(task.urgencia)
            : null;

          const urgenciaHTML = urgenciaInfo
            ? `<div class="task-urgencia ${urgenciaInfo.classe}">
               <span class="urgencia-label">Prioridade:</span>
               <span class="urgencia-value">${urgenciaInfo.texto}</span>
             </div>`
            : "";

          // Adicionar setor (mostrar em todos os cards)
          const setorHTML = task.setor
            ? `<div class="task-setor font-m-desc">
               <span class="setor-label">Setor:</span>
               <span class="setor-value">${task.setor}</span>
             </div>`
            : "";

          // Verificar se estamos na página working.html ou finishTask.html
          const isWorkingPage = document.body.id === "working-body";
          const isFinishTaskPage = document.body.id === "finishTask-body";

          card.innerHTML = `
          <h3 class="font-m-t">${task.nome_colaborador}</h3>
          ${setorHTML}
          <p class="font-m-desc">${task.descricao}</p>
          ${urgenciaHTML}
          <div class="task-footer">
            <span class="times">
              ${formatDate(task.created_at)}
            </span>

            ${
              endpoint === "pendentes"
                ? `<button class="button-1" data-id="${task.id}">Iniciar</button>`
                : endpoint === "execucao" && isWorkingPage
                ? `<button class="button-1 btn-finalizar" data-id="${task.id}">Finalizar</button>`
                : endpoint === "concluidas" && isFinishTaskPage
                ? `<button class="button-1 btn-ver-mais" data-id="${task.id}">Ver mais</button>`
                : ""
            }
          </div>
        `;

          container.appendChild(card);
        });

        // Adicionar listeners nos botões "Iniciar" e "Finalizar"
        if (endpoint === "pendentes") {
          const buttons = container.querySelectorAll(".button-1");
          buttons.forEach((button) => {
            button.addEventListener("click", async (e) => {
              const taskId = button.getAttribute("data-id");
              await abrirModalTask(taskId);
            });
          });
        }

        // Adicionar listeners nos botões "Finalizar" (apenas na página working.html)
        if (endpoint === "execucao" && document.body.id === "working-body") {
          const buttons = container.querySelectorAll(".btn-finalizar");
          buttons.forEach((button) => {
            button.addEventListener("click", async (e) => {
              const taskId = button.getAttribute("data-id");
              await abrirModalFinalizar(taskId);
            });
          });
        }

        // Adicionar listeners nos botões "Ver mais" (tarefas concluídas - apenas na página finishTask.html)
        if (
          endpoint === "concluidas" &&
          document.body.id === "finishTask-body"
        ) {
          const buttons = container.querySelectorAll(".btn-ver-mais");
          buttons.forEach((button) => {
            button.addEventListener("click", async (e) => {
              const taskId = button.getAttribute("data-id");
              await abrirModalTask(taskId);
            });
          });
        }

        // Aplicar fade-in após adicionar os cards
        setTimeout(() => {
          const newCards = container.querySelectorAll(".card");
          newCards.forEach((card) => {
            card.classList.remove("fade-out");
            card.classList.add("fade-in");
          });
        }, 10);
      } catch (error) {
        console.error(`Erro ao carregar tasks ${endpoint}`, error);
        if (container) {
          container.innerHTML =
            '<p class="font-m-desc" style="text-align: center; padding: 20px; color: #dc3545;">Erro ao carregar tarefas. Tente novamente.</p>';
        }
      }
    }, 500);
  } catch (error) {
    console.error(`Erro ao carregar tasks ${endpoint}`, error);
  }
}

// Função para buscar task e abrir modal
async function abrirModalTask(taskId) {
  try {
    const taskData = await fetchTaskById(taskId);
    openModal(taskData);
  } catch (error) {
    console.error("Erro ao buscar task:", error);
  }
}

// Função para abrir modal de finalizar (sem abrir modal de detalhes)
async function abrirModalFinalizar(taskId) {
  try {
    openConfirmFinalizar(taskId);
  } catch (error) {
    console.error("Erro ao abrir modal de finalizar:", error);
  }
}

// funções específicas (mais legível)
export function carregarPendentes(sortBy) {
  const sort = sortBy || currentSort.pendentes;
  currentSort.pendentes = sort;
  carregarPorStatus("pendentes", "tasks-pendentes", sort);
}

export function carregarEmExecucao(sortBy) {
  const sort = sortBy || currentSort.execucao;
  currentSort.execucao = sort;
  carregarPorStatus("execucao", "tasks-execucao", sort);
}

export function carregarConcluidas(sortBy) {
  const sort = sortBy || currentSort.concluidas;
  currentSort.concluidas = sort;
  carregarPorStatus("concluidas", "tasks-concluidas", sort);
}

// Exportar função para obter ordenação atual
export function getCurrentSort(column) {
  return currentSort[column] || "data-desc";
}
