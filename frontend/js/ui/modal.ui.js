const modalTask = document.querySelector(".modal-task");
const modalStartTask = document.querySelector(".modal-start-task");
const taskSections = document.querySelectorAll("[data-status]");
const modalConfirm = document.getElementById("modal-confirm");
let currentTaskId = null; // Armazenar ID da task atual
let confirmAction = "iniciar"; // "iniciar" ou "finalizar"

import { iniciarTask, finalizarTask } from "../api/task.api.js";

// Inicializar listeners
export function initCloseButton() {
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  // Listener do botão "Iniciar" no modal
  const btnIniciar = document.getElementById("btn-iniciar-task");
  if (btnIniciar) {
    btnIniciar.addEventListener("click", () => {
      openConfirmModal();
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
  const bodyText = modalConfirm?.querySelector(".modal-confirm-body p:first-child");
  const warningText = modalConfirm?.querySelector(".modal-confirm-body p:last-child");
  const btnConfirm = document.getElementById("btn-confirm-start");

  if (action === "finalizar") {
    if (header) header.textContent = "Confirmar Finalização";
    if (bodyText) bodyText.textContent = "Você realmente deseja finalizar esta tarefa?";
    if (warningText) warningText.textContent = "Esta ação não terá volta!";
    if (btnConfirm) btnConfirm.textContent = "Sim, finalizar";
  } else {
    if (header) header.textContent = "Confirmar Início";
    if (bodyText) bodyText.textContent = "Você realmente deseja iniciar esta tarefa?";
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

    // Recarregar as tasks em execução
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

export function openModal(taskData) {
  // Armazenar ID da task
  currentTaskId = taskData?.id || null;

  // Verificar se estamos na página finishTask.html para aplicar border azul
  const isFinishTaskPage = document.body.id === "finishTask-body";

  // Esconder todas as seções de tasks
  taskSections.forEach((section) => {
    section.style.display = "none";
  });

  // Preencher o modal com os dados da task
  if (taskData) {
    const modalCard = modalTask?.querySelector(".card");
    if (modalCard) {
      // Adicionar classe para border azul se estiver na página finishTask
      if (isFinishTaskPage) {
        modalCard.classList.add("modal-card-blue");
      } else {
        modalCard.classList.remove("modal-card-blue");
      }
      // Atualizar nome do colaborador
      const nomeElement = modalCard.querySelector("h3.font-m-t");
      if (nomeElement) {
        nomeElement.textContent = taskData.nome_colaborador;
      }

      // Atualizar setor (primeiro span com font-m-desc dentro do card)
      const setorElement = modalCard.querySelector(".card > span.font-m-desc");
      if (setorElement) {
        setorElement.textContent = taskData.setor || "Sem setor";
      }

      // Atualizar descrição (primeiro p com font-m-desc)
      const descricaoElement = modalCard.querySelector("p.font-m-desc");
      if (descricaoElement) {
        descricaoElement.textContent = taskData.descricao;
      }

      // Atualizar urgência
      const urgenciaValue = modalCard.querySelector(
        ".task-urgencia .urgencia-value"
      );
      if (urgenciaValue && taskData.urgencia) {
        const urgenciaLower = taskData.urgencia.toLowerCase();
        if (urgenciaLower === "urgente" || urgenciaLower === "alta") {
          urgenciaValue.textContent = "Alta";
          urgenciaValue.parentElement.className = "task-urgencia urgencia-alta";
        } else if (urgenciaLower === "media" || urgenciaLower === "média") {
          urgenciaValue.textContent = "Média";
          urgenciaValue.parentElement.className =
            "task-urgencia urgencia-media";
        } else if (urgenciaLower === "baixa") {
          urgenciaValue.textContent = "Baixa";
          urgenciaValue.parentElement.className =
            "task-urgencia urgencia-baixa";
        }
      }

      // Atualizar data
      const times = modalCard.querySelector(".times");
      if (times && taskData.created_at) {
        const date = new Date(taskData.created_at);
        times.textContent = date.toLocaleDateString("pt-BR");
      }
    }
  }

  // Mostrar o modal
  if (modalTask) {
    modalTask.style.display = "block";
  }
  if (modalStartTask) {
    modalStartTask.style.display = "flex";
  }
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
