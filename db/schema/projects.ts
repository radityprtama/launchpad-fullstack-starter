import { pgTable, text, timestamp, boolean, pgEnum, json, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { team } from "./teams";
import { template, templateVersion } from "./templates";

// Project generation status enum
export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);

// Output format enum
export const outputFormatEnum = pgEnum("output_format", [
  "download",
  "github",
  "gitlab",
]);

// Project generation configuration
export interface GenerationConfig {
  templateId: string;
  templateVersion?: string;
  variables: Record<string, any>;
  outputFormat: "download" | "github" | "gitlab";
  repositoryConfig?: {
    name: string;
    description?: string;
    private: boolean;
    owner?: string;
  };
}

export interface JobProgress {
  stage: string;
  progress: number; // 0-100
  message?: string;
  details?: any;
}

// Projects table - tracks project generation attempts
export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),

  // Ownership
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),

  // Template reference
  templateId: text("template_id")
    .notNull()
    .references(() => template.id, { onDelete: "cascade" }),
  templateVersionId: text("template_version_id").references(() => templateVersion.id),

  // Generation configuration
  generationConfig: json("generation_config").$type<GenerationConfig>().notNull(),
  variables: json("variables").notNull().default({}),

  // Generation status
  status: projectStatusEnum("status").notNull().default("pending"),
  jobId: text("job_id"), // BullMQ job ID
  progress: json("progress").$type<JobProgress>(),
  errorMessage: text("error_message"),
  errorDetails: json("error_details"),

  // Output information
  outputFormat: outputFormatEnum("output_format").notNull(),
  repositoryUrl: text("repository_url"),
  downloadUrl: text("download_url"),
  zipPath: text("zip_path"), // path to generated zip file

  // Generation timing
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // in seconds

  // File statistics
  fileCount: integer("file_count").default(0),
  totalSize: integer("total_size").default(0), // in bytes

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  // Ownership and access indexes
  userIdx: index("idx_project_user_id").on(table.userId),
  teamIdx: index("idx_project_team_id").on(table.teamId),
  nameIdx: index("idx_project_name").on(table.name),

  // Template references
  templateIdx: index("idx_project_template_id").on(table.templateId),
  templateVersionIdx: index("idx_project_template_version_id").on(table.templateVersionId),

  // Status and job tracking
  statusIdx: index("idx_project_status").on(table.status),
  jobIdIdx: uniqueIndex("idx_project_job_id").on(table.jobId),

  // Output format and sorting
  outputFormatIdx: index("idx_project_output_format").on(table.outputFormat),

  // Timing and analytics
  createdAtIdx: index("idx_project_created_at").on(table.createdAt),
  startedAtIdx: index("idx_project_started_at").on(table.startedAt),
  completedAtIdx: index("idx_project_completed_at").on(table.completedAt),
  durationIdx: index("idx_project_duration").on(table.duration),

  // File statistics
  fileCountIdx: index("idx_project_file_count").on(table.fileCount),
  totalSizeIdx: index("idx_project_total_size").on(table.totalSize),
}));

// Project files table - stores generated file information
export const projectFile = pgTable("project_file", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  content: text("content"),
  size: integer("size").default(0),
  type: text("type").notNull().default("file"), // file or directory
  executable: boolean("executable").default(false),
  checksum: text("checksum"), // for integrity checking
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  projectIdx: index("idx_project_file_project_id").on(table.projectId),
  pathIdx: index("idx_project_file_path").on(table.path),
  typeIdx: index("idx_project_file_type").on(table.type),
  sizeIdx: index("idx_project_file_size").on(table.size),
  checksumIdx: index("idx_project_file_checksum").on(table.checksum),
}));

// Project usage analytics
export const projectAnalytics = pgTable("project_analytics", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Analytics data
  downloadCount: integer("download_count").default(0),
  lastDownloadedAt: timestamp("last_downloaded_at"),
  viewCount: integer("view_count").default(0),
  lastViewedAt: timestamp("last_viewed_at"),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  projectUserIdx: uniqueIndex("idx_project_analytics_project_user").on(table.projectId, table.userId),
  projectIdx: index("idx_project_analytics_project_id").on(table.projectId),
  userIdx: index("idx_project_analytics_user_id").on(table.userId),
  downloadCountIdx: index("idx_project_analytics_download_count").on(table.downloadCount),
  viewCountIdx: index("idx_project_analytics_view_count").on(table.viewCount),
  lastDownloadedAtIdx: index("idx_project_analytics_last_downloaded").on(table.lastDownloadedAt),
  lastViewedAtIdx: index("idx_project_analytics_last_viewed").on(table.lastViewedAt),
}));

// Relations
export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [project.teamId],
    references: [team.id],
  }),
  template: one(template, {
    fields: [project.templateId],
    references: [template.id],
  }),
  templateVersion: one(templateVersion, {
    fields: [project.templateVersionId],
    references: [templateVersion.id],
  }),
  files: many(projectFile),
  analytics: many(projectAnalytics),
}));

export const projectFileRelations = relations(projectFile, ({ one }) => ({
  project: one(project, {
    fields: [projectFile.projectId],
    references: [project.id],
  }),
}));

export const projectAnalyticsRelations = relations(projectAnalytics, ({ one }) => ({
  project: one(project, {
    fields: [projectAnalytics.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [projectAnalytics.userId],
    references: [user.id],
  }),
}));

// Types
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type ProjectFile = typeof projectFile.$inferSelect;
export type NewProjectFile = typeof projectFile.$inferInsert;
export type ProjectAnalytics = typeof projectAnalytics.$inferSelect;
export type NewProjectAnalytics = typeof projectAnalytics.$inferInsert;