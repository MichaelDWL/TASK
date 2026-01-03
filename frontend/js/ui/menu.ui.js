//Sidebar
export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open_btn");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const overlay = document.getElementById("sidebar-overlay");

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add("open-sidebar");
    if (overlay) {
      overlay.classList.add("active");
    }
    document.body.classList.add("sidebar-open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open-sidebar");
    if (overlay) {
      overlay.classList.remove("active");
    }
    document.body.classList.remove("sidebar-open");
  }

  // Toggle ao clicar no botão desktop (se existir)
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains("open-sidebar")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Toggle ao clicar no botão mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains("open-sidebar")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Fechar ao clicar no overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      closeSidebar();
    });
  }

  // Fechar ao clicar em um link da sidebar (opcional - melhora UX no mobile)
  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Fechar apenas no mobile
      if (window.innerWidth <= 500) {
        setTimeout(() => closeSidebar(), 300);
      }
    });
  });

  // Fechar ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open-sidebar")) {
      closeSidebar();
    }
  });
}
