/* ============================================================
   PORTFOLIO V2 — theme.js
   Toggle de tema claro/oscuro. El data-theme inicial ya se
   setea en un script inline en el <head> (para evitar parpadeo);
   acá solo manejamos el click y el guardado de preferencia.
   ============================================================ */

/* ============================================================
   PORTFOLIO V2 — theme.js
   Toggle de tema claro/oscuro (2 botones: desktop + mobile) y
   apertura/cierre del menú hamburguesa en mobile.
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
      /* Safari privado, etc */
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
});

// document.addEventListener('DOMContentLoaded', () => {
//   const btn = document.getElementById('theme-toggle');
//   if (!btn) return;

//   function currentTheme() {
//     return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
//   }

//   function syncButton() {
//     const isLight = currentTheme() === 'light';
//     btn.setAttribute('aria-pressed', String(isLight));
//   }

//   btn.addEventListener('click', () => {
//     const next = currentTheme() === 'light' ? 'dark' : 'light';
//     document.documentElement.setAttribute('data-theme', next);
//     try { localStorage.setItem('theme', next); } catch (e) { /* Safari privado, etc */ }
//     syncButton();
//   });

//   syncButton();
// });
