export const combineAllProjects = (data: { clientProjects: any; managedProjects: any; auditedProjects: any; }) => {
  // Initialize a map to store projects based on projectId
  const projectMap = new Map();

  // Function to add projects to the map and ensure uniqueness
  const addToMap = (projects: any) => {
    projects.forEach((item: { project: { id: any; }; }) => {
      const projectId = item.project.id;
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, item.project);
      }
    });
  };

  // Add projects from clientProjects
  addToMap(data.clientProjects);
  
  // Add projects from managedProjects
  addToMap(data.managedProjects);
  
  // Add projects from auditedProjects
  addToMap(data.auditedProjects);

  // Convert map values back to an array (unique projects)
  const combinedProjects = Array.from(projectMap.values());
  
  return combinedProjects;
}