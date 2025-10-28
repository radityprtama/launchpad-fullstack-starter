import { index, uniqueIndex } from "drizzle-orm/pg-core";
import {
  team,
  teamMember,
  template,
  templateStar,
  templateVersion,
  project,
  projectFile,
  projectAnalytics
} from "./schema";

// This file exports table definitions with proper indexes
// The actual table definitions are in their respective files

// Team indexes
export const teamIndexes = {
  // For team slug lookups
  teamSlugIndex: index("idx_team_slug").on(team.slug),

  // For team member lookups
  teamMemberUserIndex: index("idx_team_member_user").on(teamMember.userId),
  teamMemberTeamIndex: index("idx_team_member_team").on(teamMember.teamId),
  teamMemberRoleIndex: index("idx_team_member_role").on(teamMember.role),
};

// Template indexes
export const templateIndexes = {
  // For template discovery and search
  templateNameIndex: index("idx_template_name").on(template.name),
  templateSlugIndex: uniqueIndex("idx_template_slug").on(template.slug),
  templateCategoryIndex: index("idx_template_category").on(template.category),
  templateVisibilityIndex: index("idx_template_visibility").on(template.visibility),

  // For ownership queries
  templateUserIndex: index("idx_template_user").on(template.userId),
  templateTeamIndex: index("idx_template_team").on(template.teamId),

  // For public templates and sorting
  templatePublicIndex: index("idx_template_public").on(template.isPublic),
  templateDownloadsIndex: index("idx_template_downloads").on(template.downloads),
  templateStarsIndex: index("idx_template_stars").on(template.stars),
  templateCreatedIndex: index("idx_template_created").on(template.createdAt),

  // For tag-based search
  templateTagsIndex: index("idx_template_tags").using("gin", template.tags),

  // For soft deletes
  templateDeletedIndex: index("idx_template_deleted").on(template.deletedAt),
};

// Template version indexes
export const templateVersionIndexes = {
  templateVersionTemplateIndex: index("idx_template_version_template").on(templateVersion.templateId),
  templateVersionVersionIndex: index("idx_template_version_version").on(templateVersion.version),
  templateVersionLatestIndex: index("idx_template_version_latest").on(templateVersion.isLatest),
  templateVersionCreatedIndex: index("idx_template_version_created").on(templateVersion.createdAt),
};

// Template star indexes
export const templateStarIndexes = {
  templateStarTemplateIndex: uniqueIndex("idx_template_star_template_user").on(templateStar.templateId, templateStar.userId),
  templateStarUserIndex: index("idx_template_star_user").on(templateStar.userId),
};

// Project indexes
export const projectIndexes = {
  // For project tracking and status queries
  projectUserIndex: index("idx_project_user").on(project.userId),
  projectTeamIndex: index("idx_project_team").on(project.teamId),
  projectTemplateIndex: index("idx_project_template").on(project.templateId),
  projectStatusIndex: index("idx_project_status").on(project.status),
  projectJobIndex: uniqueIndex("idx_project_job").on(project.jobId),

  // For sorting and analytics
  projectCreatedIndex: index("idx_project_created").on(project.createdAt),
  projectCompletedIndex: index("idx_project_completed").on(project.completedAt),
  projectDurationIndex: index("idx_project_duration").on(project.duration),

  // For output format queries
  projectOutputFormatIndex: index("idx_project_output_format").on(project.outputFormat),
};

// Project file indexes
export const projectFileIndexes = {
  projectFileProjectIndex: index("idx_project_file_project").on(projectFile.projectId),
  projectFilePathIndex: index("idx_project_file_path").on(projectFile.path),
  projectFileTypeIndex: index("idx_project_file_type").on(projectFile.type),
  projectFileSizeIndex: index("idx_project_file_size").on(projectFile.size),
};

// Project analytics indexes
export const projectAnalyticsIndexes = {
  projectAnalyticsProjectIndex: uniqueIndex("idx_project_analytics_project_user").on(projectAnalytics.projectId, projectAnalytics.userId),
  projectAnalyticsUserIndex: index("idx_project_analytics_user").on(projectAnalytics.userId),
  projectAnalyticsDownloadIndex: index("idx_project_analytics_downloads").on(projectAnalytics.downloadCount),
  projectAnalyticsViewIndex: index("idx_project_analytics_views").on(projectAnalytics.viewCount),
};