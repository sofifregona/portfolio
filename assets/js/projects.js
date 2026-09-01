function getLangFromPath() {
  const path = window.location.pathname;
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  return "en"; // default
}

const BTN_LABELS = {
  en: { more: "See more", less: "See less" },
  it: { more: "Mostra di più", less: "Mostra meno" },
  es: { more: "Ver más", less: "Ver menos" },
};

function buildFullDescHTML(fullDescription) {
  return fullDescription
    .map(
      (item) =>
        `<h4 class="project-full-desc-title">${item[0]}</h4><p class="project-full-desc-text">${item[1]}</p>`,
    )
    .join("");
}

function buildProjectCard(p, index) {
  const tagsHTML = p.tags.core_stack
    .map(
      (t) =>
        `<span class="tag${t.variant === "coral" ? " coral" : ""}">${t.text}</span>`,
    )
    .join("");

  const separator =
    window.innerWidth >= 950 || window.innerWidth <= 600 ? " · " : "<br>";
  const yearText =
    p.year + (p.subtitle !== "#" ? `${separator}${p.subtitle}` : "");

  const images = p.images && p.images.length ? p.images : [p.image];
  const slidesHTML = images
    .map(
      (src) =>
        `<div class="project-carousel-slide" data-src="${src}">
      <div class="project-carousel-slide-bg" style="background-image:url('${src}')"></div>
      </div>`,
    )
    .join("");
  const dotsHTML = images
    .map(
      (_, i) =>
        `<span class="project-carousel-dot${i === 0 ? " active" : ""}" data-i="${i}"></span>`,
    )
    .join("");
  const showArrows = images.length > 1;

  return `
    <article class="project-card reveal ${index > 1 ? "reveal-delay-" + (index - 1) : ""}">
    <div class="project-media">
        <div class="project-image">
        <div class="project-carousel-track">${slidesHTML}</div>
        <div class="project-image-overlay"></div>
        <span class="project-num">${p.num}</span>
        ${
          showArrows
            ? `<button type="button" class="project-carousel-btn prev" aria-label="Previous">‹</button>
          <button type="button" class="project-carousel-btn next" aria-label="Next">›</button>
          <div class="project-carousel-dots">${dotsHTML}</div>`
            : ""
        }
            </div>
            </div>
            <div class="project-info">
            <div class="project-body">
            <h3 class="project-name">${p.name}</h3>
            <p class="project-desc">${p.description}</p>
          <div class="project-full-desc-wrap">
            <div class="project-full-desc">${buildFullDescHTML(p.full_description)}</div>
            </div>
        </div>
        <div class="project-tags-group">
        <div class="project-tags">${tagsHTML}</div>
        ${
          p.tags.also_used.length > 0
            ? `<div class="project-tags-also">
              <p class="also-used-text">Also used: ${p.tags.also_used.join(" · ")}</p>
          </div>`
            : ""
        }
          </div>
        <div class="project-footer">
        <span class="project-year">${yearText}</span>
        <div class="project-links">
        ${p.links.site !== "#" ? `<a href="${p.links.demo}" class="project-link">Demo</a>` : ""}
        ${p.links.github !== "#" ? `<a href="${p.links.github}" class="project-link">GitHub</a>` : ""}
        <button type="button" class="project-link project-more-btn" data-index="${index}"><span class="btn-text">${BTN_LABELS[getLangFromPath()].more}</span></button>
        </div>
        </div>
        </div>
        </article>
        `;
}

function fixCardPhotoHeights() {
  if (window.innerWidth <= 600) return;
  document.querySelectorAll(".project-card").forEach((card) => {
    if (card.classList.contains("expanded")) return;
    card.dataset.compactHeight = card.getBoundingClientRect().height;

    const img = card.querySelector(".project-image");
    const h = img.getBoundingClientRect().height;
    img.style.height = h + "px";
    img.classList.add("frozen");
  });
}

function preloadCarouselImages() {
  document.querySelectorAll(".project-carousel-slide-bg").forEach((el) => {
    const match = el.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (!match) {
      console.log("NO MATCH para:", el.style.backgroundImage);
      return;
    }
    const img = new Image();
    img.src = match[1];
    if (img.decode) {
      img
        .decode()
        .then(() => console.log("Decodificada OK:", match[1]))
        .catch((err) => console.log("FALLÓ decode:", match[1], err));
    } else {
      console.log("img.decode no existe en este navegador");
    }
  });
}

function warmUpCarouselLayers() {
  document.querySelectorAll(".project-carousel-track").forEach((track) => {
    const len = track.children.length;
    if (len <= 1) return;

    track.style.transition = "none";
    let i = 1;

    function step() {
      track.style.transform = `translateX(-${i * 100}%)`;
      i++;
      if (i < len) {
        requestAnimationFrame(step);
      } else {
        requestAnimationFrame(() => {
          track.style.transform = "translateX(0%)";
          requestAnimationFrame(() => {
            track.style.transition = "";
          });
        });
      }
    }

    requestAnimationFrame(step);
  });
}

async function renderProjects() {
  const container = document.querySelector(".projects-list");
  const lang = getLangFromPath();

  try {
    const res = await fetch(
      (lang !== "en" ? "../" : "") + "data/content." + lang + ".json",
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    if (!projects.length) {
      container.innerHTML =
        '<p class="projects-empty">Proyectos próximamente.</p>';
      return;
    }

    window.projectsData = projects;
    container.innerHTML = projects
      .map((p, index) => buildProjectCard(p, index))
      .join("");
    initReveal();
    initProjectParallax();
    fixCardPhotoHeights();
    preloadCarouselImages(); // NUEVA
    warmUpCarouselLayers();
  } catch (err) {
    console.error("Error loading projects:", err);
    container.innerHTML =
      '<p class="projects-error">Couldn\'t load projects.</p>';
  }
}

document.addEventListener("DOMContentLoaded", renderProjects);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    fixCardPhotoHeights();
  }, 200);
});
