// Toggle de mostrar/ocultar senha
const togglePassword = document.getElementById("toggle-password");
const senhaInput = document.getElementById("senha");

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

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    // Aqui você pode adicionar a lógica de autenticação
    console.log("Login:", login);
    console.log("Senha:", senha);

    // Exemplo: redirecionar após login
    // window.location.href = "./index.html";
  });
}
