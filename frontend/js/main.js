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

// Função para inicializar login
async function initLogin() {
  const { login: loginAPI } = await import("./api/user.api.js");

  // Toggle de mostrar/ocultar senha
  const togglePassword = document.getElementById("toggle-password");
  const senhaInput = document.getElementById("password");

  if (togglePassword && senhaInput) {
    togglePassword.addEventListener("click", () => {
      const type =
        senhaInput.getAttribute("type") === "password" ? "text" : "password";
      senhaInput.setAttribute("type", type);

      const icon = togglePassword.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  }

  // Submissão do formulário
  const loginForm = document.getElementById("login-form");
  const btnLogin = document.querySelector(".btn-login");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loginValue = document.getElementById("login").value.trim();
      const passwordValue = document.getElementById("password").value;

      if (!loginValue || !passwordValue) {
        alert("Por favor, preencha todos os campos");
        return;
      }

      // Desabilitar botão durante o login
      if (btnLogin) {
        btnLogin.disabled = true;
        const originalText = btnLogin.innerHTML;
        btnLogin.innerHTML = "Entrando...";
        btnLogin.style.opacity = "0.6";

        try {
          const data = await loginAPI(loginValue, passwordValue);

          if (data.success) {
            // Token é salvo automaticamente em cookie httpOnly pelo servidor
            // Salvar dados do usuário no localStorage (opcional, apenas para UI)
            if (data.user) {
              localStorage.setItem("userEmail", data.user.email);
              localStorage.setItem("userName", data.user.nome);
              localStorage.setItem("userId", data.user.id);
            }

            // Redirecionar para a página principal
            window.location.href = "./index.html";
          } else {
            alert(data.message || "Erro no login");
            btnLogin.disabled = false;
            btnLogin.innerHTML = originalText;
            btnLogin.style.opacity = "1";
          }
        } catch (error) {
          console.error("Erro no login:", error);
          let errorMessage = "Erro ao conectar com o servidor";

          if (error.message) {
            errorMessage = error.message;
          } else if (
            error.name === "TypeError" &&
            error.message.includes("fetch")
          ) {
            errorMessage =
              "Não foi possível conectar ao servidor. Verifique se o servidor está rodando na porta 3000.";
          }

          alert(errorMessage);
          btnLogin.disabled = false;
          btnLogin.innerHTML = originalText;
          btnLogin.style.opacity = "1";
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Verificar se estamos na página de login
  const isLoginPage = document.body.id === "login-body";

  if (isLoginPage) {
    // Inicializar apenas funcionalidades de login
    initLogin();
  } else {
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
  }
});
