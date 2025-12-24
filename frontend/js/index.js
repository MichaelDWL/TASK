const btnClose = document.querySelector(".modal-task");
const task = document.querySelector(".task");
const menu = document.querySelector(".menu");
const menuCollapsed = document.querySelector(".menu-collapsed");

function closeMenu() {
  menu.classList.add("hidden");

  // só mostra o menu-collapsed depois da animação
  setTimeout(() => {
    menu.style.display = "none";
    menuCollapsed.style.display = "flex";
  }, 350);
}

function openMenu() {
  menu.style.display = "flex";

  // força o navegador a reprocessar antes de remover a classe
  requestAnimationFrame(() => {
    menu.classList.remove("hidden");
  });

  menuCollapsed.style.display = "none";
}

function closeModal() {
  btnClose.style.display = "none";
  task.style.display = "flex";
}

function openModal() {
  btnClose.style.display = "flex";
  task.style.display = "none";
}

// .dropdown Filter

const dropdown = document.querySelector(".dropdown");
const selected = dropdown.querySelector(".selected");
const options = dropdown.querySelector(".options");

selected.onclick = () => {
  options.style.display = options.style.display === "block" ? "none" : "block";
};

options.querySelectorAll("li").forEach((option) => {
  option.onclick = () => {
    const filtro = option.textContent.trim();
    selected.textContent = filtro; // atualiza o texto
    options.style.display = "none"; // fecha dropdown

    aplicarFiltro(filtro); // chama o filtro
  };
});

function aplicarFiltro(filtro) {
  const secoes = document.querySelectorAll("[data-status]");

  secoes.forEach((secao) => {
    const status = secao.getAttribute("data-status");

    if (filtro === "Todas" || filtro === "Tarefas") {
      // Mostrar todas
      secao.classList.remove("fade-out");
      secao.classList.add("fade-in");
      secao.style.display = "block";
    } else {
      if (status === filtro) {
        secao.style.display = "block";
        secao.classList.remove("fade-out");
        secao.classList.add("fade-in");
      } else {
        secao.classList.remove("fade-in");
        secao.classList.add("fade-out");

        // Espera a animação terminar para esconder
        setTimeout(() => {
          secao.style.display = "none";
        }, 800); // mesmo tempo do CSS
      }
    }
  });
}

// Sidebar
document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});
