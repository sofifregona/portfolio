/* ============================================================
   PORTFOLIO V2 — animations.js
   - Barra de progreso de scroll
   - Parallax en imágenes de proyectos (mouse)
   ============================================================ */

/* ── 1. Progress bar ──────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ── 2. Parallax en imágenes de cards ────────────────────── */
/*
   Mueve la imagen interna ligeramente en dirección opuesta al mouse
   para dar sensación de profundidad. Sutil: ±12px max.
*/
function initProjectParallax() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;
  if (!window.matchMedia("(hover: hover)").matches) return;

  const MAX_SHIFT = 12;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const track = card.querySelector(".project-carousel-track");
      if (!track) return;
      const index = Number(card.dataset.carouselIndex || 0);
      const bg = track.children[index]?.querySelector(
        ".project-carousel-slide-bg",
      );
      if (!bg) return;

      const rect = card.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      bg.style.transform = `translate(${-relX * MAX_SHIFT}px, ${-relY * MAX_SHIFT}px)`;
    });

    card.addEventListener("mouseleave", () => {
      const track = card.querySelector(".project-carousel-track");
      if (!track) return;
      const index = Number(card.dataset.carouselIndex || 0);
      const bg = track.children[index]?.querySelector(
        ".project-carousel-slide-bg",
      );
      if (bg) bg.style.transform = "translate(0, 0)";
    });
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
});
