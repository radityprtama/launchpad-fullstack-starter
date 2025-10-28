import { pgTable, text, timestamp, boolean, pgEnum, json, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { team } from "./teams";

// Template visibility enum
export const templateVisibilityEnum = pgEnum("template_visibility", [
  "private",
  "team",
  "public",
]);

// Template category enum
export const templateCategoryEnum = pgEnum("template_category", [
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "desktop",
  "cli",
  "other",
]);

// Stack information types
export interface StackConfig {
  framework?: string;
  language?: string;
  database?: string;
  styling?: string;
  testing?: string[];
  deployment?: string[];
}

export interface TemplateVariable {
  name: string;
  type: "string" | "number" | "boolean" | "select";
  description?: string;
  required: boolean;
  default?: string | number | boolean;
  options?: string[]; // for select type
}

export interface TemplateFile {
  path: string;
  content: string;
  type: "file" | "directory";
  executable?: boolean;
}

// Templates table
export const template = pgTable("template", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  category: templateCategoryEnum("category").notNull().default("other"),

  // Ownership
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),

  // Visibility and access
  visibility: templateVisibilityEnum("visibility").notNull().default("private"),
  isPublic: boolean("is_public").notNull().default(false),
  isOfficial: boolean("is_official").notNull().default(false),

  // Template configuration
  stack: json("stack").$type<StackConfig>().notNull(),
  variables: json("variables").$type<TemplateVariable[]>().notNull().default([]),
  fileStructure: json("file_structure").$type<TemplateFile[]>().notNull(),

  // Metadata
  tags: json("tags").$type<string[]>().default([]),
  readme: text("readme"),

  // Statistics
  downloads: integer("downloads").notNull().default(0),
  stars: integer("stars").notNull().default(0),
  forks: integer("forks").notNull().default(0),

  // Version info
  currentVersion: text("current_version").notNull().default("1.0.0"),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),

  // Soft delete
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  // Search and discovery indexes
  nameIdx: index("idx_template_name").on(table.name),
  slugIdx: uniqueIndex("idx_template_slug").on(table.slug),
  categoryIdx: index("idx_template_category").on(table.category),
  visibilityIdx: index("idx_template_visibility").on(table.visibility),

  // Ownership indexes
  userIdx: index("idx_template_user_id").on(table.userId),
  teamIdx: index("idx_template_team_id").on(table.teamId),

  // Public templates and sorting
  publicIdx: index("idx_template_public").on(table.isPublic),
  officialIdx: index("idx_template_official").on(table.isOfficial),
  downloadsIdx: index("idx_template_downloads").on(table.downloads),
  starsIdx: index("idx_template_stars").on(table.stars),
  forksIdx: index("idx_template_forks").on(table.forks),

  // Timestamp indexes
  createdAtIdx: index("idx_template_created_at").on(table.createdAt),
  updatedAtIdx: index("idx_template_updated_at").on(table.updatedAt),

  // Soft delete index
  deletedAtIdx: index("idx_template_deleted_at").on(table.deletedAt),

  // GIN index for array types (PostgreSQL specific)
  tagsIdx: index("idx_template_tags").using("gin", table.tags),
}));

// Template stars table (for bookmarking/favoriting)
export const templateStar = pgTable("template_star", {
  id: text("id").primaryKey(),
  templateId: text("template_id")
    .notNull()
    .references(() => template.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  templateUserIdx: uniqueIndex("idx_template_star_template_user").on(table.templateId, table.userId),
  templateIdx: index("idx_template_star_template_id").on(table.templateId),
  userIdx: index("idx_template_star_user_id").on(table.userId),
  createdAtIdx: index("idx_template_star_created_at").on(table.createdAt),
}));

// Relations
export const templateRelations = relations(template, ({ one, many }) => ({
  owner: one(user, {
    fields: [template.userId],
    references: [user.id],
  }),
  team: one(team, {
    fields: [template.teamId],
    references: [team.id],
  }),
  stars: many(templateStar),
  versions: many(templateVersion),
}));

export const templateStarRelations = relations(templateStar, ({ one }) => ({
  template: one(template, {
    fields: [templateStar.templateId],
    references: [template.id],
  }),
  user: one(user, {
    fields: [templateStar.userId],
    references: [user.id],
  }),
}));

// Template versions table
export const templateVersion = pgTable("template_version", {
  id: text("id").primaryKey(),
  templateId: text("template_id")
    .notNull()
    .references(() => template.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  name: text("name"),
  description: text("description"),

  // Version data
  stack: json("stack").$type<StackConfig>().notNull(),
  variables: json("variables").$type<TemplateVariable[]>().notNull().default([]),
  fileStructure: json("file_structure").$type<TemplateFile[]>().notNull(),
  readme: text("readme"),
  changelog: text("changelog"),

  // Metadata
  isLatest: boolean("is_latest").notNull().default(true),
  isStable: boolean("is_stable").notNull().default(true),

  // Created by
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  templateIdx: index("idx_template_version_template_id").on(table.templateId),
  versionIdx: index("idx_template_version_version").on(table.version),
  latestIdx: index("idx_template_version_latest").on(table.isLatest),
  stableIdx: index("idx_template_version_stable").on(table.isStable),
  createdByIdx: index("idx_template_version_created_by").on(table.createdBy),
  createdAtIdx: index("idx_template_version_created_at").on(table.createdAt),
  // Composite index for finding latest version of a template
  templateLatestIdx: uniqueIndex("idx_template_version_template_latest").on(table.templateId, table.isLatest),
}));

export const templateVersionRelations = relations(templateVersion, ({ one }) => ({
  template: one(template, {
    fields: [templateVersion.templateId],
    references: [template.id],
  }),
  creator: one(user, {
    fields: [templateVersion.createdBy],
    references: [user.id],
  }),
}));

// Types
export type Template = typeof template.$inferSelect;
export type NewTemplate = typeof template.$inferInsert;
export type TemplateStar = typeof templateStar.$inferSelect;
export type NewTemplateStar = typeof templateStar.$inferInsert;
export type TemplateVersion = typeof templateVersion.$inferSelect;
export type NewTemplateVersion = typeof templateVersion.$inferInsert;