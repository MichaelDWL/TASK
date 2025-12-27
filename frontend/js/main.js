import { initSidebar } from "./ui/menu.ui.js";
import { openModal, closeModal } from "./ui/modal.ui.js";
import { initFiltro } from "./ui/filtro.ui.js";
import {
  carregarPendentes,
  carregarEmExecucao,
  carregarConcluidas,
} from "./ui/task.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initFiltro();
  carregarPendentes();
  carregarEmExecucao();
  carregarConcluidas();
  // Expor funções globais (se usar onclick="")
  window.openModal = openModal;
  window.closeModal = closeModal;
});
