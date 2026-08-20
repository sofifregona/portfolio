/* ============================================================
   PORTFOLIO V2 — cursor.js
   Cursor personalizado: punto + anillo con lag suave
   ============================================================ */

(function () {
  /* Solo en dispositivos con hover real */
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  /* Posición actual del anillo (lag suave) */
  let ringX = -100, ringY = -100;
  let dotX  = -100, dotY  = -100;
  let targetX = -100, targetY = -100;
  let raf;

  /* Actualiza posición del punto instantáneamente */
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    /* Punto sigue al mouse directo */
    dot.style.left = targetX + 'px';
    dot.style.top  = targetY + 'px';
  });

  /* Anillo con lerp suave */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateRing() {
    ringX = lerp(ringX, targetX, 0.14);
    ringY = lerp(ringY, targetY, 0.14);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }

  raf = requestAnimationFrame(animateRing);

  /* Hover en elementos interactivos */
  const hoverEls = 'a, button, .project-card, .contact-item, .stack-item, .btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverEls)) {
      ring.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverEls)) {
      ring.classList.remove('hover');
    }
  });

  /* Click feedback */
  document.addEventListener('mousedown', () => {
    ring.classList.add('click');
    dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
  });

  document.addEventListener('mouseup', () => {
    ring.classList.remove('click');
    dot.style.transform = '';
  });

  /* Ocultar al salir de la ventana */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();
