// Toggle de mostrar/ocultar senha
const API_URL = "http://localhost:3000";

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
const btnLogin = document.getElementById("btn-login");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector("input[name='login']").value.trim();
    const password = form.querySelector("input[name='password']").value;

    btnLogin.disabled = true;
    btnLogin.textContent = "Logando...";
    btnLogin.style.opacity = "30%";
    // Aqui você pode adicionar a lógica de autenticação

    const data = await res.json(); // <-- login

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.ok) {
        localStorage.setItem("userEmail", email);
        window.location.href = "/index.html";
      } else {
        btnLogin.disabled = false;
        btnLogin.textContent = "Login";
        btnLogin.style.opacity = "100%";
        alert(data.message || "Erro no login");
      }
    } catch (error) {
      btnLogin.disabled = false;
      btnLogin.textContent = "Login";
      btnLogin.style.opacity = "100%";
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor");
    }
  });
}
