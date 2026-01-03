export function initSearch() {
  const input = document.getElementById("pesquisar");
  if (!input) return;

  let currentIndex = -1;
  let matches = [];
  const HIGHLIGHT_CLASS = "search-highlight";
  const ACTIVE_HIGHLIGHT_CLASS = "search-highlight-active";

  // Normalizar texto (remove acentos, lowercase)
  function normalize(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Remover todos os highlights
  function clearHighlights() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    matches = [];
    currentIndex = -1;
  }

  // Adicionar highlight em um elemento de texto
  function highlightText(node, searchTerm) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const normalizedText = normalize(text);
      const normalizedSearch = normalize(searchTerm);

      if (normalizedText.includes(normalizedSearch)) {
        const regex = new RegExp(
          `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi"
        );
        const highlightedText = text.replace(regex, (match) => {
          const span = document.createElement("span");
          span.className = HIGHLIGHT_CLASS;
          span.textContent = match;
          return span.outerHTML;
        });

        const temp = document.createElement("div");
        temp.innerHTML = highlightedText;
        const fragment = document.createDocumentFragment();
        while (temp.firstChild) {
          fragment.appendChild(temp.firstChild);
        }
        node.parentNode.replaceChild(fragment, node);
        return true;
      }
    }
    return false;
  }

  // Buscar e destacar em todos os elementos visíveis
  function searchAndHighlight(searchTerm) {
    clearHighlights();
    if (!searchTerm || searchTerm.length < 2) {
      updateCounter(0, 0);
      return;
    }

    // Áreas onde buscar (cards de tarefas, textos visíveis)
    const searchAreas = [
      ...document.querySelectorAll(".card"),
      ...document.querySelectorAll("h2, h3"),
      ...document.querySelectorAll(".font-m-desc, .font-m-t"),
    ];

    matches = [];

    searchAreas.forEach((area) => {
      const walker = document.createTreeWalker(
        area,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        if (highlightText(node, searchTerm)) {
          // Encontrar o span criado
          const highlights = area.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
          highlights.forEach((span) => {
            if (!matches.includes(span)) {
              matches.push(span);
            }
          });
        }
      }
    });

    updateCounter(matches.length, 0);
    if (matches.length > 0) {
      navigateToMatch(0);
    }
  }

  // Atualizar contador de resultados
  function updateCounter(total, current) {
    let counter = document.getElementById("search-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.id = "search-counter";
      counter.className = "search-counter";
      input.parentNode.appendChild(counter);
    }

    if (total === 0) {
      counter.textContent = "";
      counter.style.display = "none";
    } else {
      counter.textContent = `${current + 1} de ${total}`;
      counter.style.display = "block";
    }
  }

  // Navegar para um resultado específico
  function navigateToMatch(index) {
    if (matches.length === 0) return;

    // Remover highlight ativo anterior
    document
      .querySelectorAll(`.${ACTIVE_HIGHLIGHT_CLASS}`)
      .forEach((el) => el.classList.remove(ACTIVE_HIGHLIGHT_CLASS));

    currentIndex = Math.max(0, Math.min(index, matches.length - 1));
    const match = matches[currentIndex];

    if (match) {
      match.classList.add(ACTIVE_HIGHLIGHT_CLASS);
      match.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      updateCounter(matches.length, currentIndex);
    }
  }

  // Event listeners
  input.addEventListener("input", (e) => {
    const term = e.target.value.trim();
    searchAndHighlight(term);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearHighlights();
      input.value = "";
      updateCounter(0, 0);
      input.blur();
      return;
    }

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      if (matches.length > 0) {
        navigateToMatch(currentIndex + 1);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length > 0) {
        navigateToMatch(currentIndex - 1);
      }
      return;
    }
  });

  // Limpar ao perder foco (opcional - você pode remover se quiser manter os highlights)
  // input.addEventListener("blur", () => {
  //   setTimeout(() => clearHighlights(), 200);
  // });
}
