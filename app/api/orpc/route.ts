import { POST } from "@/lib/orpc";

export { POST };

// Available routes for documentation
export const availableRoutes = [
  // Templates
  "createTemplate",
  "updateTemplate",
  "getTemplate",
  "listTemplates",
  "deleteTemplate",
  "starTemplate",
  "createTemplateVersion",
  "generateProject",
  "getProjectGenerationProgress",

  // Projects
  "createProject",
  "updateProject",
  "getProject",
  "listProjects",
  "deleteProject",
  "deployProject",
  "getProjectLogs",
  "retryProject",
  "archiveProject",
  "getProjectAnalytics",

  // User
  "getCurrentUser",
  "updateUserProfile",

  // Teams
  "getUserTeams",
  "createTeam",

  // Analytics
  "getUserAnalytics",
];
