import { criarTask } from "../api/task.api.js";
import { fetchSetores } from "../api/setor.api.js";
import { fetchLocais } from "../api/local.api.js";
// COMENTADO: Import para criar setor "outros" - Descomente se precisar usar em outra tela
// import { criarOuBuscarSetor } from "../api/setor.api.js";
// COMENTADO: Import para criar local "outros" - Descomente se precisar usar em outra tela
// import { criarOuBuscarLocal } from "../api/local.api.js";

/**
 * Inicializa o formulário de criação de tarefas
 */
export async function initForms() {
  await Promise.all([carregarSetores(), carregarLocais()]);
  configurarFormulario();
  configurarOpcaoOutros();
}

/**
 * Carrega os setores do banco de dados e popula o select
 */
async function carregarSetores() {
  try {
    const setores = await fetchSetores();
    const selectSetor = document.getElementById("setor");

    if (!selectSetor) return;

    // Limpar opções existentes (exceto a primeira que é placeholder)
    selectSetor.innerHTML = '<option value="">Selecione seu setor</option>';

    // Adicionar setores do banco
    setores.forEach((setor) => {
      const option = document.createElement("option");
      option.value = setor.id;
      option.textContent = setor.nome;
      selectSetor.appendChild(option);
    });

    // COMENTADO: Adicionar opção "Outros" - Descomente se precisar usar em outra tela
    /*
    const optionOutros = document.createElement("option");
    optionOutros.value = "outros";
    optionOutros.textContent = "Outros";
    selectSetor.appendChild(optionOutros);
    */
  } catch (error) {
    console.error("Erro ao carregar setores:", error);
    // Em caso de erro, manter os setores padrão ou mostrar mensagem
  }
}

/**
 * Carrega os locais do banco de dados e popula o select
 */
async function carregarLocais() {
  try {
    const locais = await fetchLocais();
    const selectLocal = document.getElementById("local");

    if (!selectLocal) return;

    // Limpar opções existentes (exceto a primeira que é placeholder)
    selectLocal.innerHTML = '<option value="">Selecione o local (opcional)</option>';

    // Adicionar locais do banco
    locais.forEach((local) => {
      const option = document.createElement("option");
      option.value = local.id;
      option.textContent = local.nome;
      selectLocal.appendChild(option);
    });

    // COMENTADO: Adicionar opção "Outros" - Descomente se precisar usar em outra tela
    /*
    const optionOutros = document.createElement("option");
    optionOutros.value = "outros";
    optionOutros.textContent = "Outros";
    selectLocal.appendChild(optionOutros);
    */
  } catch (error) {
    console.error("Erro ao carregar locais:", error);
    // Em caso de erro, definir mensagem padrão
    const selectLocal = document.getElementById("local");
    if (selectLocal) {
      selectLocal.innerHTML = '<option value="">Erro ao carregar locais</option>';
    }
  }
}

/**
 * Configura o campo "Outros" para aparecer quando selecionado
 */
function configurarOpcaoOutros() {
  // COMENTADO: Configuração do "Outros" para setor - Descomente se precisar usar em outra tela
  /*
  const selectSetor = document.getElementById("setor");
  const outroSetorGroup = document.getElementById("outro-setor-group");

  // Configurar "Outros" no select de setor
  if (selectSetor && outroSetorGroup) {
    selectSetor.addEventListener("change", (e) => {
      if (e.target.value === "outros") {
        outroSetorGroup.style.display = "flex";
        document.getElementById("outro-setor").required = true;
      } else {
        outroSetorGroup.style.display = "none";
        const outroSetorInput = document.getElementById("outro-setor");
        if (outroSetorInput) {
          outroSetorInput.required = false;
          outroSetorInput.value = "";
        }
      }
    });
  }
  */

  // Configurar "Outros" nos checkboxes de solicitação (mantido ativo)
  const outrosCheckbox = document.getElementById("outros-checkbox");
  const descricaoOutrosGroup = document.getElementById("descricao-outros-group");

  if (outrosCheckbox && descricaoOutrosGroup) {
    outrosCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        descricaoOutrosGroup.style.display = "flex";
        document.getElementById("descricao-texto").required = true;
      } else {
        descricaoOutrosGroup.style.display = "none";
        const descricaoTexto = document.getElementById("descricao-texto");
        if (descricaoTexto) {
          descricaoTexto.required = false;
          descricaoTexto.value = "";
        }
      }
    });
  }
}

/**
 * Configura o envio do formulário
 */
function configurarFormulario() {
  const form = document.getElementById("forms-request");
  const btnSubmit = form?.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Desabilitar botão durante envio
    if (btnSubmit) {
      btnSubmit.disabled = true;
      const originalText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = "Enviando...";
      btnSubmit.style.opacity = "0.6";

      try {
        // Obter valores do formulário
        const nomeColaborador = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const setorId = document.getElementById("setor").value;
        const localId = document.getElementById("local")?.value;
        // COMENTADO: Variável para "outros" setor - Descomente se precisar usar em outra tela
        // const outroSetor = document.getElementById("outro-setor")?.value.trim();
        // COMENTADO: Variável para "outros" local - Descomente se precisar usar em outra tela
        // const outroLocal = document.getElementById("outro-local")?.value.trim();
        const urgencia = document.querySelector(
          'input[name="urgencia"]:checked'
        )?.value;
        const descricao = obterDescricaoTarefa();

        // Validar campos obrigatórios
        if (!nomeColaborador) {
          alert("Por favor, preencha o nome do colaborador.");
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.opacity = "1";
          return;
        }

        if (!setorId || setorId === "") {
          alert("Por favor, selecione um setor.");
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.opacity = "1";
          return;
        }

        if (!descricao) {
          alert("Por favor, selecione pelo menos uma solicitação ou descreva sua solicitação.");
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.opacity = "1";
          return;
        }

        // Processar setor (apenas usar o ID selecionado, sem opção "outros")
        const setorIdFinal = setorId;

        // COMENTADO: Lógica para criar/buscar setor "outros" - Descomente se precisar usar em outra tela
        /*
        let setorIdFinal = setorId;

        // Se selecionou "Outros", criar ou buscar o setor
        if (setorId === "outros") {
          if (!outroSetor) {
            alert("Por favor, informe o nome do setor.");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
            btnSubmit.style.opacity = "1";
            return;
          }

          try {
            const setor = await criarOuBuscarSetor(outroSetor);
            setorIdFinal = setor.id;
          } catch (error) {
            console.error("Erro ao criar/buscar setor:", error);
            alert("Erro ao processar setor. Tente novamente.");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
            btnSubmit.style.opacity = "1";
            return;
          }
        }
        */

        // Processar local (opcional)
        const localIdFinal = localId && localId !== "" ? parseInt(localId) : null;

        // COMENTADO: Lógica para criar/buscar local "outros" - Descomente se precisar usar em outra tela
        /*
        let localIdFinal = localId;

        // Se selecionou "Outros", criar ou buscar o local
        if (localId === "outros") {
          if (!outroLocal) {
            alert("Por favor, informe o nome do local.");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
            btnSubmit.style.opacity = "1";
            return;
          }

          try {
            const local = await criarOuBuscarLocal(outroLocal);
            localIdFinal = local.id;
          } catch (error) {
            console.error("Erro ao criar/buscar local:", error);
            alert("Erro ao processar local. Tente novamente.");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
            btnSubmit.style.opacity = "1";
            return;
          }
        }
        */

        // Criar tarefa
        const taskData = {
          nome_colaborador: nomeColaborador,
          descricao: descricao,
          urgencia: urgencia || "media",
          setor_id: setorIdFinal && setorIdFinal !== "" ? parseInt(setorIdFinal) : null,
          local_id: localIdFinal,
        };

        await criarTask(taskData);

        // Sucesso
        alert("Tarefa criada com sucesso!");
        form.reset();
        
        // Esconder campos "outros" se estiverem visíveis
        // COMENTADO: Limpar campo "outros" setor - Descomente se precisar usar em outra tela
        /*
        const outroSetorGroup = document.getElementById("outro-setor-group");
        if (outroSetorGroup) {
          outroSetorGroup.style.display = "none";
        }
        */
        
        const descricaoOutrosGroup = document.getElementById("descricao-outros-group");
        if (descricaoOutrosGroup) {
          descricaoOutrosGroup.style.display = "none";
        }

        // Resetar radio buttons (voltar para média)
        const radioMedia = document.getElementById("urgencia-media");
        if (radioMedia) {
          radioMedia.checked = true;
        }

        // Redirecionar ou limpar formulário
        // window.location.href = "./index.html";
      } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        alert(error.message || "Erro ao criar tarefa. Tente novamente.");
      } finally {
        // Reabilitar botão
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.opacity = "1";
        }
      }
    }
  });
}

/**
 * Obtém a descrição da tarefa baseado nos checkboxes selecionados ou campo de texto
 */
function obterDescricaoTarefa() {
  // Buscar todos os checkboxes selecionados, exceto o "outros"
  const todosCheckboxes = document.querySelectorAll(
    '.forms-task input[type="checkbox"]:checked'
  );
  
  // Filtrar para excluir o checkbox "outros"
  const checkboxes = Array.from(todosCheckboxes).filter(
    (cb) => cb.id !== "outros-checkbox" && cb.value !== "outros"
  );
  
  const textAreaDescricao = document.getElementById("descricao-texto");

  let descricao = "";

  // Se houver checkboxes selecionados (exceto "outros")
  if (checkboxes.length > 0) {
    const valores = checkboxes.map((cb) => cb.value);
    descricao = valores.join(", ");
  }

  // Se houver campo de texto "outros" preenchido, adicionar
  if (textAreaDescricao && textAreaDescricao.value.trim()) {
    if (descricao) {
      descricao += " - " + textAreaDescricao.value.trim();
    } else {
      descricao = textAreaDescricao.value.trim();
    }
  }

  // Validar que há pelo menos uma descrição
  if (!descricao || descricao.trim() === "") {
    return null; // Retornar null para indicar que precisa de descrição
  }

  return descricao.trim();
}

