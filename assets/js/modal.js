/* ============================================================
   PORTFOLIO V2 — modal.js
   Modal de "ver más" para proyectos: blur + carrusel manual
   ============================================================ */

let modalCarouselIndex = 0;
let modalCarouselImages = [];

function ensureModalDOM() {
  if (document.querySelector(".project-modal-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "project-modal-overlay";
  overlay.innerHTML = `
    <div class="project-modal" role="dialog" aria-modal="true">
      <button type="button" class="project-modal-close" aria-label="Cerrar">✕</button>
      <div class="project-modal-columns">
        <div class="project-modal-media">
          <div class="project-modal-carousel">
            <div class="project-modal-carousel-track"></div>
            <button type="button" class="project-modal-carousel-btn prev" aria-label="Anterior">‹</button>
            <button type="button" class="project-modal-carousel-btn next" aria-label="Siguiente">›</button>
            <div class="project-modal-carousel-dots"></div>
          </div>
          <div class="project-modal-tags">
            <div class="project-modal-tags-core-stack"></div>
            <div class="project-modal-tags-also-used"></div>
          </div>
        </div>
        <div class="project-modal-text">
          <p class="project-modal-year"></p>
          <h3 class="project-modal-name"></h3>
          <div class="project-modal-desc-wrap">
            <div class="project-modal-desc"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProjectModal();
  });
  overlay
    .querySelector(".project-modal-close")
    .addEventListener("click", closeProjectModal);
  overlay
    .querySelector(".project-modal-carousel-btn.prev")
    .addEventListener("click", () => shiftCarousel(-1));
  overlay
    .querySelector(".project-modal-carousel-btn.next")
    .addEventListener("click", () => shiftCarousel(1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

function openProjectModal(project, index, originEl) {
  ensureModalDOM();
  const overlay = document.querySelector(".project-modal-overlay");
  const modal = overlay.querySelector(".project-modal");
  const columns = overlay.querySelector(".project-modal-columns");

  // Flip según paridad, igual que .project-card:nth-child(even)
  columns.classList.toggle("flip", index % 2 === 1);

  if (originEl) {
    const rect = originEl.getBoundingClientRect();
    modal.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
  }

  modalCarouselImages =
    project.images && project.images.length ? project.images : [project.image];
  modalCarouselIndex = 0;

  const track = overlay.querySelector(".project-modal-carousel-track");
  track.innerHTML = modalCarouselImages
    .map(
      (src) =>
        `<div class="project-modal-carousel-slide" style="background-image:url('${src}')"></div>`,
    )
    .join("");

  const dots = overlay.querySelector(".project-modal-carousel-dots");
  dots.innerHTML = modalCarouselImages
    .map(
      (_, i) =>
        `<span class="project-modal-dot${i === 0 ? " active" : ""}" data-i="${i}"></span>`,
    )
    .join("");
  dots.querySelectorAll(".project-modal-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      modalCarouselIndex = Number(dot.dataset.i);
      updateCarousel();
    });
  });

  const showArrows = modalCarouselImages.length > 1;
  overlay.querySelector(".project-modal-carousel-btn.prev").style.display =
    showArrows ? "flex" : "none";
  overlay.querySelector(".project-modal-carousel-btn.next").style.display =
    showArrows ? "flex" : "none";
  dots.style.display = showArrows ? "flex" : "none";

  overlay.querySelector(".project-modal-tags-core-stack").innerHTML =
    project.tags.core_stack
      .map(
        (t) =>
          `<span class="tag${t.variant === "coral" ? " coral" : ""}">${t.text}</span>`,
      )
      .join("");
  overlay.querySelector(".project-modal-tags-also-used").innerHTML =
    `<p class="also-used-text"> Also used: ${project.tags.also_used
      .map((t) => t)
      .join(" · ")}</p>`;
  overlay.querySelector(".project-modal-name").textContent = project.name;
  overlay.querySelector(".project-modal-year").textContent = project.year;
  const desc = overlay.querySelector(".project-modal-desc");
  desc.innerHTML = ""; // nuevo: limpiar antes de llenar

  project.full_description.map((item) => {
    desc.innerHTML += `<h4 class="project-modal-desc-title">${item[0]}</h4><p class="project-modal-desc-text">${item[1]}</p>`;
  });

  updateCarousel();

  const descWrap = overlay.querySelector(".project-modal-desc-wrap");
  const descEl = overlay.querySelector(".project-modal-desc");
  descEl.scrollTop = 0; // nuevo: siempre arranca arriba del todo

  function updateDescFades() {
    const atTop = descEl.scrollTop <= 2;
    const atBottom =
      descEl.scrollTop + descEl.clientHeight >= descEl.scrollHeight - 2;
    descWrap.classList.toggle("can-scroll-up", !atTop);
    descWrap.classList.toggle("can-scroll-down", !atBottom);
  }

  descEl.removeEventListener("scroll", updateDescFades);
  descEl.addEventListener("scroll", updateDescFades);
  updateDescFades();

  overlay.classList.add("open");
  document.body.classList.add("modal-open");
}

function shiftCarousel(dir) {
  const len = modalCarouselImages.length;
  modalCarouselIndex = (modalCarouselIndex + dir + len) % len;
  updateCarousel();
}

function updateCarousel() {
  const overlay = document.querySelector(".project-modal-overlay");
  const track = overlay.querySelector(".project-modal-carousel-track");
  track.style.transform = `translateX(-${modalCarouselIndex * 100}%)`;

  overlay.querySelectorAll(".project-modal-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === modalCarouselIndex);
  });
}

function closeProjectModal() {
  const overlay = document.querySelector(".project-modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.classList.remove("modal-open");
}

/* Delegación de eventos: escucha clicks en cualquier botón "Ver más",
   sin importar que las cards se generen dinámicamente después */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".project-more-btn");
  if (!btn) return;
  const index = Number(btn.dataset.index);
  if (window.projectsData && window.projectsData[index]) {
    openProjectModal(window.projectsData[index], index, btn);
  }
});
