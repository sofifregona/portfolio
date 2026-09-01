/* ============================================================
   PORTFOLIO V2 — ui.js
   Nav scroll, scroll-reveal, active section, smooth links
   ============================================================ */

/* ── Nav scrolled class ───────────────────────────────────── */
function initNav() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  const toggle = () => nav.classList.toggle("scrolled", window.scrollY > 50);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
}

/* ── Scroll-reveal ────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll(".reveal, .reveal-left");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
  );

  els.forEach((el) => observer.observe(el));
}

/* ── Active section highlight en nav ─────────────────────── */
/* Resalta el link del nav cuya sección está actualmente visible en pantalla */
function initActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.style.color = isActive ? "var(--text)" : "";
          });
        }
      });
    },
    { threshold: 0.45 },
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── Smooth scroll ────────────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initActiveSection();
  initSmoothLinks();
});
