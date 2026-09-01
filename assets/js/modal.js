/* ============================================================
   PORTFOLIO V2 — modal.js
   Expandir/contraer cards de proyecto, carrusel de imágenes
   y lightbox para verlas en grande
   ============================================================ */

let lightboxCard = null;
let lightboxIndex = 0;

function ensureLightboxDOM() {
  if (document.querySelector(".image-lightbox")) return;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.innerHTML = `
    <button type="button" class="image-lightbox-close" aria-label="Close">✕</button>
    <button type="button" class="image-lightbox-btn prev" aria-label="Previous">‹</button>
    <img class="image-lightbox-img" src="" alt="">
    <button type="button" class="image-lightbox-btn next" aria-label="Next">›</button>
    <div class="image-lightbox-dots"></div>
  `;
  document.body.appendChild(lightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox
    .querySelector(".image-lightbox-close")
    .addEventListener("click", closeLightbox);
  lightbox
    .querySelector(".image-lightbox-btn.prev")
    .addEventListener("click", () => shiftLightbox(-1));
  lightbox
    .querySelector(".image-lightbox-btn.next")
    .addEventListener("click", () => shiftLightbox(1));

  document.addEventListener("keydown", (e) => {
    const lb = document.querySelector(".image-lightbox");
    if (!lb || !lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") shiftLightbox(1);
    if (e.key === "ArrowLeft") shiftLightbox(-1);
  });
}

function openLightbox(card, index) {
  ensureLightboxDOM();
  lightboxCard = card;
  lightboxIndex = index;
  stopCardAutoplay(card);
  updateLightboxImage();
  updateLightboxDots();
  document.querySelector(".image-lightbox").classList.add("active");
}

function shiftLightbox(dir) {
  const track = lightboxCard.querySelector(".project-carousel-track");
  const len = track.children.length;
  lightboxIndex = (lightboxIndex + dir + len) % len;

  const img = document.querySelector(".image-lightbox-img");
  img.classList.add("fading");

  setTimeout(() => {
    updateLightboxImage();
    img.classList.remove("fading");
  }, 200);

  updateLightboxDots();

  // El carrusel de la card queda sincronizado con lo que se ve en el lightbox
  lightboxCard.dataset.carouselIndex = lightboxIndex;
  updateCardCarousel(lightboxCard);
}

function updateLightboxImage() {
  const track = lightboxCard.querySelector(".project-carousel-track");
  const src = track.children[lightboxIndex].dataset.src;
  document.querySelector(".image-lightbox-img").src =
    src.split(".")[0] + "_max.jpg";
}

function updateLightboxDots() {
  const track = lightboxCard.querySelector(".project-carousel-track");
  const len = track.children.length;
  const dots = document.querySelector(".image-lightbox-dots");
  dots.innerHTML = Array.from({ length: len })
    .map(
      (_, i) =>
        `<span class="image-lightbox-dot${i === lightboxIndex ? " active" : ""}" data-i="${i}"></span>`,
    )
    .join("");

  dots.querySelectorAll(".image-lightbox-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const newIndex = Number(dot.dataset.i);
      const dir = newIndex - lightboxIndex;
      shiftLightbox(dir > 0 ? 1 : dir < 0 ? -1 : 0);
    });
  });
}

function closeLightbox() {
  const lightbox = document.querySelector(".image-lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("active");
  if (lightboxCard) startCardAutoplay(lightboxCard);
  lightboxCard = null;
}

// Nuevo: abre el lightbox al clickear una imagen del carrusel dentro del modal
document.addEventListener("click", (e) => {
  const slide = e.target.closest(".project-carousel-slide");
  if (!slide) return;
  const card = slide.closest(".project-card");
  if (!card || !card.classList.contains("expanded")) return; // solo en expandida
  const track = slide.closest(".project-carousel-track");
  const index = Array.from(track.children).indexOf(slide);
  openLightbox(card, index);
});

function setButtonTextAnimated(btn, newText) {
  if (btn.dataset.animating === "true") return;
  btn.dataset.animating = "true";

  const span = btn.querySelector(".btn-text");
  const startWidth = btn.getBoundingClientRect().width;
  btn.style.width = startWidth + "px";

  span.style.opacity = "0";

  setTimeout(() => {
    span.textContent = newText;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        btn.style.width = "auto";
        const endWidth = btn.scrollWidth;
        btn.style.width = startWidth + "px";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            btn.style.width = endWidth + "px";
            span.style.opacity = "1";
          });
        });

        btn.addEventListener("transitionend", function handler(e) {
          if (e.propertyName !== "width") return;
          btn.style.width = "";
          btn.dataset.animating = "false";
          btn.removeEventListener("transitionend", handler);
        });
      });
    });
  }, 150);
}

function updateCardCarousel(card) {
  const track = card.querySelector(".project-carousel-track");
  const index = Number(card.dataset.carouselIndex || 0);
  track.style.transform = `translateX(-${index * 100}%)`;
  card.querySelectorAll(".project-carousel-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function shiftCardCarousel(card, dir) {
  const track = card.querySelector(".project-carousel-track");
  const len = track.children.length;
  let index = Number(card.dataset.carouselIndex || 0);
  index = (index + dir + len) % len;
  card.dataset.carouselIndex = index;
  updateCardCarousel(card);
}

const cardAutoplayTimers = new WeakMap();

function startCardAutoplay(card) {
  stopCardAutoplay(card);
  const track = card.querySelector(".project-carousel-track");
  if (!track || track.children.length <= 1) return;
  const timer = setInterval(() => shiftCardCarousel(card, 1), 4000);
  cardAutoplayTimers.set(card, timer);
}

function stopCardAutoplay(card) {
  const timer = cardAutoplayTimers.get(card);
  if (timer) clearInterval(timer);
  cardAutoplayTimers.delete(card);
}

function countTagRows(container) {
  const children = Array.from(container.children);
  if (!children.length) return 1;

  let rows = 1;
  let lastTop = children[0].offsetTop;

  children.forEach((el) => {
    if (Math.abs(el.offsetTop - lastTop) > 3) {
      rows++;
      lastTop = el.offsetTop;
    }
  });

  return rows;
}

function toggleProjectCard(card) {
  if (card.classList.contains("animating")) return;
  card.classList.add("animating");
  const willExpand = !card.classList.contains("expanded");
  const isStacked = window.innerWidth <= 600; // ← NUEVA

  const btn = card.querySelector(".project-more-btn");
  const img = card.querySelector(".project-image");
  const media = card.querySelector(".project-media");
  const tagsGroupEl = card.querySelector(".project-tags-group");
  const tagsAlsoEl = card.querySelector(".project-tags-also");
  const info = card.querySelector(".project-info");
  const footer = card.querySelector(".project-footer");
  const descEl = card.querySelector(".project-desc");
  const fullDescWrap = card.querySelector(".project-full-desc-wrap");
  const fullDescEl = card.querySelector(".project-full-desc");

  const infoCompactHeight = info.getBoundingClientRect().height;
  card.style.height = "";
  const startHeight = card.getBoundingClientRect().height;
  card.style.height = startHeight + "px";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (willExpand) {
        const currentImgHeight = img.getBoundingClientRect().height;

        descEl.style.opacity = "0";
        tagsGroupEl.style.opacity = "0";

        setTimeout(() => {
          card.classList.add("expanded");
          if (!isStacked) media.appendChild(tagsGroupEl);
          if (tagsAlsoEl) tagsAlsoEl.style.display = "block";
          setButtonTextAnimated(btn, BTN_LABELS[getLangFromPath()].less);
          startCardAutoplay(card);

          descEl.style.display = "none";
          fullDescWrap.style.display = "block";
          fullDescEl.scrollTop = 0;

          if (isStacked) {
            const EXTRA_SPACING = infoCompactHeight < 300 ? 120 : 100; // poné acá el valor que quieras
            const alsoUsedHeight = tagsAlsoEl ? tagsAlsoEl.scrollHeight : 0;
            const targetHeight =
              currentImgHeight +
              infoCompactHeight +
              alsoUsedHeight +
              EXTRA_SPACING;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.height = targetHeight + "px";
                card.style.maxHeight = targetHeight + "px";
                fullDescWrap.style.opacity = "1";
                tagsGroupEl.style.opacity = "1";
              });
            });
          } else {
            const EXTRA_SPACING = 68;
            const tagsEl = tagsGroupEl.querySelector(".project-tags");
            const newHeight =
              currentImgHeight +
              tagsEl.scrollHeight +
              (tagsAlsoEl ? tagsAlsoEl.scrollHeight : -20);
            const targetHeight = newHeight + EXTRA_SPACING;

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.height = targetHeight + "px";
                card.style.maxHeight = targetHeight + "px";
                fullDescWrap.style.opacity = "1";
                tagsGroupEl.style.opacity = "1";
              });
            });
          }

          updateFullDescFades(fullDescWrap, fullDescEl);
          fullDescEl.addEventListener("scroll", () =>
            updateFullDescFades(fullDescWrap, fullDescEl),
          );
        }, 300);
      } else {
        setButtonTextAnimated(btn, BTN_LABELS[getLangFromPath()].more);
        fullDescWrap.style.opacity = "0";
        tagsGroupEl.style.opacity = "0";
        descEl.style.opacity = "0";

        setTimeout(() => {
          if (!isStacked) info.insertBefore(tagsGroupEl, footer);

          if (tagsAlsoEl) tagsAlsoEl.style.display = "";
          fullDescWrap.style.display = "none";
          descEl.style.display = "block";

          card.classList.remove("expanded");

          stopCardAutoplay(card);

          card.style.height = "auto";
          const naturalHeight = card.scrollHeight;
          card.style.height = startHeight + "px";

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.maxHeight = naturalHeight + "px";
              card.style.height = naturalHeight + "px";
            });
          });
        }, 300);
      }
    });
  });

  card.addEventListener("transitionend", function handler(e) {
    if (e.propertyName !== "height") return;
    card.removeEventListener("transitionend", handler);
    card.classList.remove("animating");

    if (!willExpand) {
      card.style.height = "";
      descEl.style.opacity = "1";
      tagsGroupEl.style.opacity = "1";
    }
  });
}

function updateFullDescFades(wrap, el) {
  const atTop = el.scrollTop <= 2;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
  wrap.classList.toggle("can-scroll-up", !atTop);
  wrap.classList.toggle("can-scroll-down", !atBottom);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".project-more-btn");
  if (!btn) return;
  const card = btn.closest(".project-card");
  if (card) toggleProjectCard(card);
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".project-carousel-btn");
  if (!btn) return;
  const card = btn.closest(".project-card");
  if (!card) return;
  shiftCardCarousel(card, btn.classList.contains("prev") ? -1 : 1);
});

document.addEventListener("click", (e) => {
  const dot = e.target.closest(".project-carousel-dot");
  if (!dot) return;
  const card = dot.closest(".project-card");
  if (!card) return;
  card.dataset.carouselIndex = dot.dataset.i;
  updateCardCarousel(card);
});
