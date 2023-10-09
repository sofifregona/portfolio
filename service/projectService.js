const projectList = async () => {
  try {
    const response = await fetch(
      "https://sofifregona.github.io/portfolio/db.json"
    );
    const data = await response.json();
    return data.projects
  } catch (error) {
    return console.log(error);
  }
};

const projectDetail = async (id) => {
  try {
    const response = await fetch(
      "https://sofifregona.github.io/portfolio/db.json"
    );
    const data = await response.json();
    const projectFound = data.projects.find(project => project.id === id);
    console.log(projectFound)
    return projectFound
  } catch (error) {
    return console.log(error);
  }
};

export const projectService = {
  projectList,
  projectDetail
}
