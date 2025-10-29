import { z } from "zod";

// Template schemas
export const TemplateCategoryEnum = z.enum([
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "desktop",
  "cli",
  "other",
]);

export const TemplateVisibilityEnum = z.enum([
  "private",
  "team",
  "public",
]);

export const TemplateStatusEnum = z.enum([
  "draft",
  "published",
  "deprecated",
]);

// Stack configuration types
export const StackConfigSchema = z.object({
  framework: z.string().optional(),
  language: z.string().optional(),
  database: z.string().optional(),
  styling: z.string().optional(),
  testing: z.array(z.string()).optional(),
  deployment: z.array(z.string()).optional(),
});

export const TemplateVariableSchema = z.object({
  name: z.string(),
  type: z.enum(["string", "number", "boolean", "select"]),
  description: z.string().optional(),
  required: z.boolean(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(z.string()).optional(),
});

export const TemplateFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.enum(["file", "directory"]),
  executable: z.boolean().optional(),
});

// API Schemas
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  slug: z.string().min(1, "Template slug is required"),
  description: z.string().optional(),
  category: TemplateCategoryEnum,
  visibility: TemplateVisibilityEnum,
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().optional(),
  tags: z.array(z.string()),
}).transform(data => ({
  ...data,
  visibility: data.visibility || "private",
  variables: data.variables || [],
  tags: data.tags || []
}));

const BaseCreateTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  slug: z.string().min(1, "Template slug is required"),
  description: z.string().optional(),
  category: TemplateCategoryEnum,
  visibility: TemplateVisibilityEnum,
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().optional(),
  tags: z.array(z.string()),
}).transform(data => ({
  ...data,
  visibility: data.visibility || "private",
  variables: data.variables || [],
  tags: data.tags || []
}));

const BaseCreateTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  slug: z.string().min(1, "Template slug is required"),
  description: z.string().optional(),
  category: TemplateCategoryEnum,
  visibility: TemplateVisibilityEnum,
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().optional(),
  tags: z.array(z.string()),
}).transform(data => ({
  ...data,
  visibility: data.visibility || "private",
  variables: data.variables || [],
  tags: data.tags || []
}));

export const CreateTemplateSchema = BaseCreateTemplateSchema;
export const UpdateTemplateSchema = BaseCreateTemplateSchema.partial();

export const GetTemplateSchema = z.object({
  id: z.string(),
});

export const ListTemplatesSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  category: TemplateCategoryEnum.optional(),
  visibility: TemplateVisibilityEnum.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["popularity", "recent", "downloads", "stars"]).default("popularity"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  tags: z.array(z.string()).optional(),
  isOfficial: z.boolean().optional(),
});

export const DeleteTemplateSchema = z.object({
  id: z.string(),
});

export const StarTemplateSchema = z.object({
  templateId: z.string(),
});

export const RateTemplateSchema = z.object({
  templateId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export const GenerateProjectSchema = z.object({
  templateId: z.string(),
  variables: z.record(z.unknown()),
  projectName: z.string().min(1, "Project name is required"),
  deploymentPlatform: z.enum(["vercel", "netlify", "railway", "other"]),
}).transform(data => ({
  ...data,
  deploymentPlatform: data.deploymentPlatform || "vercel"
}));

export const CreateTemplateVersionSchema = z.object({
  templateId: z.string(),
  version: z.string().min(1, "Version is required"),
  name: z.string().optional(),
  description: z.string().optional(),
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().optional(),
  changelog: z.string().optional(),
  isLatest: z.boolean().default(true),
  isStable: z.boolean().default(true),
});

// Response schemas
export const TemplateResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  category: TemplateCategoryEnum,
  visibility: TemplateVisibilityEnum,
  isOfficial: z.boolean(),
  isPublic: z.boolean(),
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().nullable(),
  tags: z.array(z.string()),
  downloads: z.number(),
  stars: z.number(),
  forks: z.number(),
  currentVersion: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  team: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
});

export const TemplateListResponseSchema = z.object({
  templates: z.array(TemplateResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const TemplateVersionSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  version: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  stack: StackConfigSchema,
  variables: z.array(TemplateVariableSchema),
  fileStructure: z.array(TemplateFileSchema),
  readme: z.string().nullable(),
  changelog: z.string().nullable(),
  isLatest: z.boolean(),
  isStable: z.boolean(),
  createdBy: z.string(),
  createdAt: z.date(),
});

export const ProjectGenerationSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  projectName: z.string(),
  variables: z.record(z.unknown()),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  downloadUrl: z.string().nullable(),
  deploymentUrl: z.string().nullable(),
  logs: z.array(z.string()).optional(),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
  userId: z.string(),
});

// Export types
export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateSchema>;
export type ListTemplatesInput = z.infer<typeof ListTemplatesSchema>;
export type GenerateProjectInput = z.infer<typeof GenerateProjectSchema>;
export type CreateTemplateVersionInput = z.infer<typeof CreateTemplateVersionSchema>;
export type StarTemplateInput = z.infer<typeof StarTemplateSchema>;
export type RateTemplateInput = z.infer<typeof RateTemplateSchema>;

export type TemplateResponse = z.infer<typeof TemplateResponseSchema>;
export type TemplateListResponse = z.infer<typeof TemplateListResponseSchema>;
export type TemplateVersion = z.infer<typeof TemplateVersionSchema>;
export type ProjectGeneration = z.infer<typeof ProjectGenerationSchema>;
