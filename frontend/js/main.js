import { initSidebar } from "./ui/menu.ui.js";
import { openModal, closeModal, initCloseButton } from "./ui/modal.ui.js";
import { initFiltro } from "./ui/filtro.ui.js";
import { initSort } from "./ui/sort.ui.js";
import {
  carregarPendentes,
  carregarEmExecucao,
  carregarConcluidas,
} from "./ui/task.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initFiltro();
  initSort();
  initCloseButton(); // Adicionar esta linha
  carregarPendentes();
  carregarEmExecucao();
  carregarConcluidas();
  // Expor funções globais (se usar onclick="")
  window.openModal = openModal;
  window.closeModal = closeModal;
});
