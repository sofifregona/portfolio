const projectList = async () => {
  try {
    const response = await fetch(
      /*"https://sofifregona.github.io/portfolio/db.json"*/
      "../db.json"
    );
    const data = await response.json();
    return data.projects
  } catch (error) {
    return console.log(error);
  }
};

const general = async () => {
  try {
    const response = await fetch(
      /*"https://sofifregona.github.io/portfolio/db.json"*/
      "../db.json"
    );
    const data = await response.json();
    return data.general
  } catch (error) {
    return console.log(error);
  }
};

export const projectService = {
  projectList,
  general
}
