export function initFiltro() {
  const dropdown = document.querySelector(".dropdown");
  const selected = dropdown.querySelector(".selected");
  const options = dropdown.querySelector(".options");

  selected.onclick = () => {
    options.style.display =
      options.style.display === "block" ? "none" : "block";
  };

  options.querySelectorAll("li").forEach((option) => {
    option.onclick = () => {
      const filtro = option.textContent.trim();
      selected.textContent = filtro;
      options.style.display = "none";
      aplicarFiltro(filtro);
    };
  });
}

function aplicarFiltro(filtro) {
  const secoes = document.querySelectorAll("[data-status]");

  secoes.forEach((secao) => {
    const status = secao.getAttribute("data-status");

    if (filtro === "Todas" || filtro === "Tarefas") {
      secao.style.display = "block";
      secao.classList.remove("fade-out");
      secao.classList.add("fade-in");
    } else if (status === filtro) {
      secao.style.display = "block";
      secao.classList.remove("fade-out");
      secao.classList.add("fade-in");
    } else {
      secao.classList.remove("fade-in");
      secao.classList.add("fade-out");
      setTimeout(() => {
        secao.style.display = "none";
      }, 800);
    }
  });
}
