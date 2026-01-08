import {
  carregarPendentes,
  carregarEmExecucao,
  carregarConcluidas,
} from "./task.ui.js";

/**
 * Inicializa a funcionalidade de refresh
 */
export function initRefresh() {
  const refreshBtn = document.getElementById("refresh-btn");

  if (!refreshBtn) return;

  refreshBtn.addEventListener("click", async () => {
    // Adicionar animação de rotação contínua
    const icon = refreshBtn.querySelector("i");
    if (!icon) return;

    // Aplicar animação contínua
    icon.style.animation = "spin 1s linear infinite";
    refreshBtn.disabled = true;
    refreshBtn.style.opacity = "0.6";
    refreshBtn.style.cursor = "not-allowed";

    try {
      // Recarregar tarefas baseado na página atual
      const isWorkingPage = document.body.id === "working-body";
      const isFinishTaskPage = document.body.id === "finishTask-body";

      if (isWorkingPage) {
        // Página de tarefas em execução
        carregarEmExecucao();
      } else if (isFinishTaskPage) {
        // Página de tarefas concluídas
        carregarConcluidas();
      } else {
        // Página principal (index.html) - recarregar todas
        carregarPendentes();
        carregarEmExecucao();
        carregarConcluidas();
      }

      // Aguardar um tempo mínimo para feedback visual (animação deve continuar)
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Erro ao atualizar tarefas:", error);
    } finally {
      // Remover animação e reabilitar botão
      icon.style.animation = "";
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = "1";
      refreshBtn.style.cursor = "pointer";
    }
  });
}

