import { initSidebar } from "./ui/menu.ui.js";
import { openModal, closeModal } from "./ui/modal.ui.js";
import { initFiltro } from "./ui/filtro.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initFiltro();
  // Expor funções globais (caso seu HTML use onclick="")
  window.closeMenu = closeMenu;
  window.openModal = openModal;
  window.closeModal = closeModal;
});
