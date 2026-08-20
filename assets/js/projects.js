function getLangFromPath() {
  const path = window.location.pathname;

  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  return "en"; // default
}

async function renderProjects() {
  const container = document.querySelector(".projects-list");
  const lang = getLangFromPath();

  try {
    const res = await fetch("./data/content." + lang + ".json");
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
    console.log(container.innerHTML);
    initReveal();
    initProjectParallax();
  } catch (err) {
    console.error("Error cargando proyectos:", err);
    container.innerHTML =
      '<p class="projects-error">No se pudieron cargar los proyectos.</p>';
  }
}

function buildProjectCard(p, index) {
  console.log(p.tags);
  const tagsHTML = p.tags.core_stack
    .map(
      (t) =>
        `<span class="tag${t.variant === "coral" ? " coral" : ""}">${t.text}</span>`,
    )
    .join("");

  return `
    <article class="project-card reveal ${index > 1 ? "reveal-delay-" + index - 1 : ""}">
      <div class="project-image">
        <div class="project-image-inner" style="background-image: url('${p.image}');"></div>
        <div class="project-image-overlay"></div>
        <span class="project-num">${p.num}</span>
      </div>
      <div class="project-info">
      <div class="project-body">
          <h3 class="project-name">${p.name}</h3>
          <p class="project-desc">${p.description}</p>
          </div>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-footer">
          <span class="project-year">${p.year}</span>
          <div class="project-links">
          <button type="button" class="project-link project-more-btn" data-index="${index}">Ver más</button>
            ${p.links.site !== "#" ? `<a href="${p.links.demo}" class="project-link primary">Demo</a>` : ""}
            ${p.links.github !== "#" ? `<a href="${p.links.github}" class="project-link">GitHub</a>` : ""}
          </div>
        </div>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", renderProjects);
