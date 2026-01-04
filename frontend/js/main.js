import { initSidebar } from "./ui/menu.ui.js";
import { openModal, closeModal, initCloseButton } from "./ui/modal.ui.js";
import { initFiltro } from "./ui/filtro.ui.js";
import { initSort } from "./ui/sort.ui.js";
import {
  carregarPendentes,
  carregarEmExecucao,
  carregarConcluidas,
} from "./ui/task.ui.js";
import { initSearch } from "./ui/search.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar componentes básicos
  initSidebar();
  initSort();
  initCloseButton();
  initSearch();

  // Inicializar filtro apenas se o dropdown existir
  if (document.querySelector(".dropdown")) {
    initFiltro();
  }

  // Carregar tarefas apenas se os containers existirem
  if (document.getElementById("tasks-pendentes")) {
    carregarPendentes();
  }
  if (document.getElementById("tasks-execucao")) {
    carregarEmExecucao();
  }
  if (document.getElementById("tasks-concluidas")) {
    carregarConcluidas();
  }

  // Expor funções globais (se usar onclick="")
  window.openModal = openModal;
  window.closeModal = closeModal;
});
