const modalTask = document.querySelector(".modal-task");
const modalStartTask = document.querySelector(".modal-start-task");
const taskSections = document.querySelectorAll("[data-status]");
const modalConfirm = document.getElementById("modal-confirm");
let currentTaskId = null; // Armazenar ID da task atual
let confirmAction = "iniciar"; // "iniciar" ou "finalizar"

import { iniciarTask, finalizarTask } from "../api/task.api.js";
import { formatDate } from "../utils/formatDate.js";
import { calculateTimeAgo, calculateTotalTime } from "../utils/timeAgo.js";

// Inicializar listeners
export function initCloseButton() {
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  // Listener do botão "Cancelar" no modal de confirmação
  const btnCancel = document.getElementById("btn-cancel-confirm");
  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      closeConfirmModal();
    });
  }

  // Listener do botão de confirmação no modal (pode ser iniciar ou finalizar)
  const btnConfirm = document.getElementById("btn-confirm-start");
  if (btnConfirm) {
    btnConfirm.addEventListener("click", async () => {
      if (confirmAction === "iniciar") {
        await confirmarInicio();
      } else if (confirmAction === "finalizar") {
        await confirmarFinalizar();
      }
    });
  }
}

// Abrir modal de confirmação para iniciar
function openConfirmModal() {
  currentTaskId = currentTaskId; // Usar o ID já armazenado
  if (modalConfirm) {
    confirmAction = "iniciar";
    updateConfirmModalText("iniciar");
    modalConfirm.classList.add("active");
  }
}

// Abrir modal de confirmação para finalizar
export function openConfirmFinalizar(taskId) {
  if (modalConfirm) {
    currentTaskId = taskId;
    confirmAction = "finalizar";
    updateConfirmModalText("finalizar");
    modalConfirm.classList.add("active");
  }
}

// Atualizar texto do modal de confirmação
function updateConfirmModalText(action) {
  const header = modalConfirm?.querySelector(".modal-confirm-header h3");
  const bodyText = modalConfirm?.querySelector(
    ".modal-confirm-body p:first-child"
  );
  const warningText = modalConfirm?.querySelector(
    ".modal-confirm-body p:last-child"
  );
  const btnConfirm = document.getElementById("btn-confirm-start");

  if (action === "finalizar") {
    if (header) header.textContent = "Confirmar Finalização";
    if (bodyText)
      bodyText.textContent = "Você realmente deseja finalizar esta tarefa?";
    if (warningText) warningText.textContent = "Esta ação não terá volta!";
    if (btnConfirm) btnConfirm.textContent = "Sim, finalizar";
  } else {
    if (header) header.textContent = "Confirmar Início";
    if (bodyText)
      bodyText.textContent = "Você realmente deseja iniciar esta tarefa?";
    if (warningText) warningText.textContent = "Esta ação não terá volta!";
    if (btnConfirm) btnConfirm.textContent = "Sim, iniciar";
  }
}

// Fechar modal de confirmação
function closeConfirmModal() {
  if (modalConfirm) {
    modalConfirm.classList.remove("active");
  }
}

// Confirmar início da tarefa
async function confirmarInicio() {
  if (!currentTaskId) {
    console.error("ID da tarefa não encontrado");
    return;
  }

  try {
    await iniciarTask(currentTaskId);

    // Fechar modais
    closeConfirmModal();
    closeModal();

    // Recarregar as tasks
    const { carregarPendentes, carregarEmExecucao } = await import(
      "./task.ui.js"
    );
    carregarPendentes();
    carregarEmExecucao();
  } catch (error) {
    console.error("Erro ao iniciar tarefa:", error);
    alert("Erro ao iniciar a tarefa. Tente novamente.");
  }
}

// Confirmar finalização da tarefa
async function confirmarFinalizar() {
  if (!currentTaskId) {
    console.error("ID da tarefa não encontrado");
    return;
  }

  try {
    await finalizarTask(currentTaskId);

    // Fechar modal de confirmação
    closeConfirmModal();

    // Recarregar as tasks
    const { carregarEmExecucao, carregarConcluidas } = await import(
      "./task.ui.js"
    );
    carregarEmExecucao();
    carregarConcluidas();
  } catch (error) {
    console.error("Erro ao finalizar tarefa:", error);
    alert("Erro ao finalizar a tarefa. Tente novamente.");
  }
}

// Abrir modal com dados da task
export function openModal(taskData) {
  if (!modalTask || !modalStartTask) return;

  // Armazenar o ID da task
  currentTaskId = taskData.id;

  // Formatar urgência
  const urgenciaFormatada = taskData.urgencia
    ? taskData.urgencia.charAt(0).toUpperCase() + taskData.urgencia.slice(1)
    : "Média";

  // Determinar classe de urgência
  let urgenciaClasse = "urgencia-media";
  if (taskData.urgencia === "alta") urgenciaClasse = "urgencia-alta";
  if (taskData.urgencia === "baixa") urgenciaClasse = "urgencia-baixa";

  // Construir HTML do modal com todas as informações
  const card = modalStartTask.querySelector(".card");
  if (card) {
    // Verificar se é task em execução ou concluída (tem executor)
    const temExecutor = taskData.usuario_executor;

    const executorHTML = temExecutor
      ? `<div class="modal-info-group">
           <span class="modal-label">Executor:</span>
           <span class="modal-value">${taskData.usuario_executor}</span>
         </div>`
      : "";

    const solicitanteHTML = temExecutor
      ? `<div class="modal-info-group">
           <span class="modal-label">Solicitante:</span>
           <span class="modal-value">${taskData.nome_colaborador || ""}</span>
         </div>`
      : `<h3 class="font-m-t c-h modal-title">${
          taskData.nome_colaborador || ""
        }</h3>`;

    const setorHTML = taskData.setor
      ? `<div class="modal-info-group">
           <span class="modal-label">Setor:</span>
           <span class="modal-value">${taskData.setor}</span>
         </div>`
      : "";

    const localHTML = taskData.local
      ? `<div class="modal-info-group">
           <span class="modal-label">Local:</span>
           <span class="modal-value">${taskData.local}</span>
         </div>`
      : "";

    const urgenciaHTML = `
      <div class="modal-info-group">
        <span class="modal-label">Prioridade:</span>
        <div>
        <span class="modal-value ${urgenciaClasse}">${urgenciaFormatada}</span>
        </div>
      </div>`;

    const descricaoHTML = `
      <div class="modal-info-group modal-descricao">
        <span class="modal-label">Descrição:</span>
        <p class="modal-value modal-descricao-text">${
          taskData.descricao || ""
        }</p>
      </div>`;

    const dataHTML = `
      <div class="modal-info-group">
        <span class="modal-label">Data de criação:</span>
        <span class="modal-value times">${formatDate(
          taskData.created_at
        )}</span>
      </div>`;

    // Calcular e exibir tempo decorrido
    let tempoDecorridoHTML = "";
    if (taskData.status === "em_execucao" && taskData.inicio_execucao) {
      const tempoIniciado = calculateTimeAgo(taskData.inicio_execucao);
      tempoDecorridoHTML = `
        <div class="modal-info-group">
          <span class="modal-label">Iniciada há:</span>
          <span class="modal-value">${tempoIniciado}</span>
        </div>`;
    } else if (
      taskData.status === "concluida" &&
      taskData.fim_execucao &&
      taskData.created_at
    ) {
      const tempoTotal = calculateTotalTime(
        taskData.created_at,
        taskData.fim_execucao
      );
      tempoDecorridoHTML = `
        <div class="modal-info-group">
          <span class="modal-label">Resolvida em:</span>
          <span class="modal-value">${tempoTotal}</span>
        </div>`;
    }

    // Botão "Iniciar" apenas para tasks pendentes
    const btnIniciarHTML =
      !temExecutor && document.body.id !== "finishTask-body"
        ? `<button class="button-1" id="btn-iniciar-task">Iniciar</button>`
        : "";

    card.innerHTML = `
      ${temExecutor ? "" : solicitanteHTML}
      ${executorHTML}
      ${temExecutor ? solicitanteHTML : ""}
      ${setorHTML}
      ${localHTML}
      ${urgenciaHTML}
      ${descricaoHTML}
      ${dataHTML}
      ${tempoDecorridoHTML}
      <div class="modal-footer">
        ${btnIniciarHTML}
      </div>
    `;

    // Re-adicionar listener ao botão "Iniciar" após reconstruir o HTML
    if (!temExecutor && document.body.id !== "finishTask-body") {
      const btnIniciar = document.getElementById("btn-iniciar-task");
      if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
          openConfirmModal();
        });
      }
    }
  }

  // Adicionar classe para borda azul se estiver em finishTask.html
  const modalCard = modalStartTask.querySelector(".card");
  if (document.body.id === "finishTask-body") {
    if (modalCard) modalCard.classList.add("modal-card-blue");
  }

  // Exibir o modal
  modalTask.style.display = "flex";
  modalStartTask.style.display = "flex";

  // Esconder todas as seções de tasks
  taskSections.forEach((section) => {
    section.style.display = "none";
  });
}

export function closeModal() {
  // Limpar ID da task
  currentTaskId = null;

  // Remover classe de border azul ao fechar
  const modalCard = modalTask?.querySelector(".card");
  if (modalCard) {
    modalCard.classList.remove("modal-card-blue");
  }

  // Esconder o modal
  if (modalTask) {
    modalTask.style.display = "none";
  }
  if (modalStartTask) {
    modalStartTask.style.display = "none";
  }

  // Fechar modal de confirmação se estiver aberto
  closeConfirmModal();

  // Mostrar todas as seções de tasks novamente
  taskSections.forEach((section) => {
    section.style.display = "block";
  });
}
