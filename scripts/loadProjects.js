import { projectService } from "../service/projectService.js";

var columns = document.querySelectorAll(".main-column");
var columns_avaible = [];
columns.forEach(column => {
  if (getComputedStyle(column).getPropertyValue("display") != "none") columns_avaible.push(column);
});

console.log(columns_avaible.length)

var url = window.location.href;

projectService.projectList().then((response) => {
  const parameter = url.split("?lang=")[1];
  var lang = 0;
  if (parameter == "en") lang = 1;
  else if (parameter == "it") lang = 2;
  for (let i = 0; i < response.length; i++){
    for (var j = 0; j < columns_avaible.length; j++) {
      const column = columns_avaible[j]
      if (i+j < response.length) {
        console.log(response[i+j])
        const line = createProject(response[i+j], lang)
        column.appendChild(line);
      }
    }
    i += (columns_avaible.length - 1);
  }
  var githubs = document.querySelectorAll(".link-github");
  githubs.forEach(github => {
    if (github.href == url) github.style.cssText = "display: none;";
  });
  var websites = document.querySelectorAll(".link-website");
  websites.forEach(website => {
    if (website.href == url) website.style.cssText = "display: none;";
  });
});

const createProject = (project, lang) => {
  const line = document.createElement("div");
  line.id = project.id
  line.classList.add("project");
  const content = `
    <img class="project-photo" id="img${project.id}" src="../assets/img/${project.photo}"></img>
    <div class="project-info" id="project${project.id}">
      <p class="project-subtitle">${project.subtitle[lang]}</p>  
      <p class="project-title">${project.title}</p>
      <p class="project-description">${project.description[lang]}</p>
      <div class="project-buttons">
        <a class="link-github" href="${project.repo}"><button class="project-repo">GitHub</button></a>
        <a class="link-website" href="${project.website}"><button class="project-repo">Website</button></a>
      </div>
    </div>
  `
  line.innerHTML = content;
  return line;
}

