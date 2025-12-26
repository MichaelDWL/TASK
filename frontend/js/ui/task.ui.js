import { formatDate } from "../utils/formatDate.js";

export async function carregarTasks() {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();

    const container = document.getElementById("task-container");
    container.innerHTML = "";

    tasks.forEach((task) => {
      const card = document.createElement("div");
      card.classList.add("task-card");

      card.innerHTML = `
        <h3>${task.nome_colaborador}</h3>
        <p>${task.descricao}</p>

        <div class="task-footer">
          <span class="times">
            ${formatDate(task.created_at)}
          </span>
          <button class="btn-start">Iniciar</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar tasks", error);
  }
}
