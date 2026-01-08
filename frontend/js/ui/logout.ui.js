import { logout } from "../api/user.api.js";

let modalLogoutConfirm = null;

/**
 * Inicializa a funcionalidade de logout
 */
export function initLogout() {
  const logoutBtn = document.querySelector(".logout_btn");
  modalLogoutConfirm = document.getElementById("modal-logout-confirm");

  if (!logoutBtn) return;

  // Configurar botões do modal de logout
  if (modalLogoutConfirm) {
    const btnCancel = document.getElementById("btn-cancel-logout");
    const btnConfirm = document.getElementById("btn-confirm-logout");

    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        closeLogoutModal();
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener("click", async () => {
        await confirmarLogout();
      });
    }

    // Fechar modal ao clicar fora dele
    modalLogoutConfirm.addEventListener("click", (e) => {
      if (e.target === modalLogoutConfirm) {
        closeLogoutModal();
      }
    });

    // Fechar modal com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalLogoutConfirm?.classList.contains("active")) {
        closeLogoutModal();
      }
    });
  }

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openLogoutModal();
  });
}

/**
 * Abre o modal de confirmação de logout
 */
function openLogoutModal() {
  if (modalLogoutConfirm) {
    modalLogoutConfirm.classList.add("active");
  }
}

/**
 * Fecha o modal de confirmação de logout
 */
function closeLogoutModal() {
  if (modalLogoutConfirm) {
    modalLogoutConfirm.classList.remove("active");
  }
}

/**
 * Confirma e executa o logout
 */
async function confirmarLogout() {
  const btnConfirm = document.getElementById("btn-confirm-logout");
  
  if (!btnConfirm) return;

  // Desabilitar botão durante logout
  btnConfirm.disabled = true;
  const originalText = btnConfirm.textContent;
  btnConfirm.textContent = "Saindo...";

  try {
    // Tentar fazer logout no servidor (remove cookie httpOnly)
    try {
      await logout();
    } catch (error) {
      // Se erro for "token não fornecido" ou similar, ignorar silenciosamente
      // Usuário pode já estar deslogado ou token expirado
      if (
        error.message &&
        (error.message.includes("Token não fornecido") ||
          error.message.includes("não autenticado") ||
          error.message.includes("401") ||
          error.message.includes("token"))
      ) {
        console.log("Token não encontrado ou expirado. Limpando dados localmente.");
      } else {
        console.error("Erro ao fazer logout:", error);
      }
    }

    // Sempre limpar dados do usuário no localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    // Fechar modal
    closeLogoutModal();

    // Redirecionar para a página de login
    window.location.href = "./login.html";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    
    // Mesmo com erro, limpar localStorage e redirecionar
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    closeLogoutModal();
    window.location.href = "./login.html";
  } finally {
    // Reabilitar botão (caso o redirecionamento não aconteça imediatamente)
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.textContent = originalText;
    }
  }
}

