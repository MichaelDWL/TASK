import {
  carregarPendentes,
  carregarEmExecucao,
  carregarConcluidas,
  getCurrentSort,
} from "./task.ui.js";

export function initSort() {
  const sortButtons = document.querySelectorAll(".btn-class");
  const sortOptions = document.querySelectorAll(".sort-options");

  // Fechar dropdowns ao clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-class")) {
      sortOptions.forEach((options) => {
        options.classList.remove("active");
      });
    }
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const column = button.getAttribute("data-column");
      const options = document.querySelector(
        `.sort-options[data-column="${column}"]`
      );

      if (!options) return; // Se não encontrar as opções, não faz nada

      // Fechar outros dropdowns
      sortOptions.forEach((opt) => {
        if (opt !== options) {
          opt.classList.remove("active");
        }
      });

      // Toggle do dropdown atual
      options.classList.toggle("active");

      // Marcar opção ativa
      const currentSort = getCurrentSort(column);
      options.querySelectorAll("li").forEach((li) => {
        if (li.getAttribute("data-sort") === currentSort) {
          li.classList.add("active");
        } else {
          li.classList.remove("active");
        }
      });
    });
  });

  // Adicionar listeners nas opções de ordenação
  sortOptions.forEach((options) => {
    const column = options.getAttribute("data-column");

    options.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const sortBy = li.getAttribute("data-sort");

        // Remover active de todas as opções
        options.querySelectorAll("li").forEach((item) => {
          item.classList.remove("active");
        });

        // Adicionar active na opção selecionada
        li.classList.add("active");

        // Fechar dropdown
        options.classList.remove("active");

        // Adicionar classe active no btn-class quando uma opção é selecionada
        const filterClass = options.closest(".filter-class");
        const button = filterClass?.querySelector(".btn-class");
        if (button) button.classList.add("active");

        // Atualizar label do botão
        const buttonElement = document.querySelector(
          `.btn-class[data-column="${column}"]`
        );
        if (buttonElement) {
          const label = buttonElement.querySelector(".sort-label");
          if (label) {
            label.textContent = li.textContent.trim();
          }
        }

        // Carregar tarefas com nova ordenação
        switch (column) {
          case "pendentes":
            carregarPendentes(sortBy);
            break;
          case "execucao":
            carregarEmExecucao(sortBy);
            break;
          case "concluidas":
            carregarConcluidas(sortBy);
            break;
        }
      });
    });
  });
}
