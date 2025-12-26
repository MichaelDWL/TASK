import { initSidebar } from "./ui/menu.ui.js";
import { openModal, closeModal } from "./ui/modal.ui.js";
import { initFiltro } from "./ui/filtro.ui.js";
import { carregarTasks } from "./ui/task.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initFiltro();
  carregarTasks();
  // Expor funções globais (se usar onclick="")
  window.openModal = openModal;
  window.closeModal = closeModal;
});
