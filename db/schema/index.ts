// Export all schemas
export * from "./auth";
export * from "./teams";
export * from "./templates";
export * from "./projects";

// Export all types for easier importing
export type {
  User,
  Session,
  Account,
  Verification,
  NewUser,
  NewSession,
  NewAccount,
  NewVerification,
} from "./auth";

export type {
  Team,
  TeamMember,
  NewTeam,
  NewTeamMember,
} from "./teams";

export type {
  Template,
  TemplateStar,
  TemplateVersion,
  NewTemplate,
  NewTemplateStar,
  NewTemplateVersion,
  StackConfig,
  TemplateVariable,
  TemplateFile,
} from "./templates";

export type {
  Project,
  ProjectFile,
  ProjectAnalytics,
  NewProject,
  NewProjectFile,
  NewProjectAnalytics,
  GenerationConfig,
  JobProgress,
} from "./projects";

// Export enums (these will be available when importing from their respective modules)
// Users should import enums directly from their schema files:
// import { teamRoleEnum, templateVisibilityEnum } from "./teams";
// import { templateCategoryEnum } from "./templates";
// import { projectStatusEnum, outputFormatEnum } from "./projects";