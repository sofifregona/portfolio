/* ============================================================
   PORTFOLIO V2 — theme.js
   Toggle de tema claro/oscuro (2 botones: desktop + mobile),
   con guardado de preferencia, y apertura/cierre del menú
   hamburguesa en mobile. El data-theme inicial ya se setea en
   un script inline en el <head> (para evitar parpadeo).
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- TEMA ---------- */
  const themeButtons = [
    document.getElementById("theme-toggle"),
    document.getElementById("mobile-theme-toggle"),
  ].filter(Boolean);

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  function syncThemeButtons() {
    const isLight = currentTheme() === "light";
    themeButtons.forEach((btn) =>
      btn.setAttribute("aria-pressed", String(isLight)),
    );
  }

  function toggleTheme() {
    const next = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* Si falla (Safari privado, cookies bloqueadas, etc.), el tema
      simplemente no persiste entre visitas — no rompe nada más */
    }
    syncThemeButtons();
  }

  themeButtons.forEach((btn) => btn.addEventListener("click", toggleTheme));
  syncThemeButtons();

  /* ---------- MENÚ HAMBURGUESA ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!menuToggle || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar el menú al tocar cualquier link de navegación
  mobileMenu.querySelectorAll(".mobile-menu-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Cerrar al tocar afuera del menú
  document.addEventListener("click", (e) => {
    if (!mobileMenu.classList.contains("open")) return;
    if (mobileMenu.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });
});

// Registrar idioma de preferencia
document
  .querySelectorAll(".lang-switch a, .mobile-lang-switch a")
  .forEach((link) => {
    link.addEventListener("click", () => {
      try {
        localStorage.setItem(
          "langChoice",
          link.textContent.trim().toLowerCase(),
        );
      } catch (e) {}
    });
  });
