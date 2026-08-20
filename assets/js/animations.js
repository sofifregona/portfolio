/* ============================================================
   PORTFOLIO V2 — animations.js
   - Barra de progreso de scroll
   - Parallax en imágenes de proyectos (mouse)
   - Animación de barras de skills (IntersectionObserver)
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

  /* Solo en hover real */
  if (!window.matchMedia("(hover: hover)").matches) return;

  const MAX_SHIFT = 12; /* px */

  cards.forEach((card) => {
    const inner = card.querySelector(".project-image-inner");
    if (!inner) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      /* Posición relativa al centro de la card, -1..1 */
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      /* Movimiento opuesto al mouse, sin offset base (la imagen ya está
         posicionada con `inset` en CSS, no necesita -50%/-50%) */
      const shiftX = -relX * MAX_SHIFT;
      const shiftY = -relY * MAX_SHIFT;
      inner.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    });

    card.addEventListener("mouseleave", () => {
      inner.style.transform = "translate(0, 0)";
    });
  });
}

/* ── 3. Scroll con click + arrastre del mouse ────────────── */
/*
   Permite desplazarse por la página manteniendo click y arrastrando,
   como si fuera un "grab to scroll". No interfiere con clicks normales
   en links/botones (se desactiva el drag si el target es interactivo).
*/
function initDragScroll() {
  if (!window.matchMedia("(hover: hover)").matches) return;

  let isDown = false;
  let startY = 0;
  let startScroll = 0;
  let dragged = false;

  const interactiveSelector =
    "a, button, input, textarea, select, .project-card, .contact-item, .skill-pill";

  document.addEventListener("mousedown", (e) => {
    /* No iniciar drag-scroll sobre elementos interactivos */
    if (e.target.closest(interactiveSelector)) return;

    isDown = true;
    dragged = false;
    startY = e.clientY;
    startScroll = window.scrollY;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const delta = e.clientY - startY;
    if (Math.abs(delta) > 3) dragged = true;
    window.scrollTo({ top: startScroll - delta, behavior: "auto" });
  });

  function endDrag() {
    isDown = false;
    document.body.style.userSelect = "";
  }

  document.addEventListener("mouseup", endDrag);
  document.addEventListener("mouseleave", endDrag);
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  // initDragScroll();
});
