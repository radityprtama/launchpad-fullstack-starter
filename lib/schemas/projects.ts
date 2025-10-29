import { z } from "zod";

// Project schemas
export const ProjectStatusEnum = z.enum([
  "draft",
  "building",
  "deployed",
  "failed",
  "archived",
]);

export const OutputFormatEnum = z.enum([
  "zip",
  "git-repo",
  "direct-deploy",
]);

export const GenerationConfigSchema = z.object({
  includeTests: z.boolean().default(true),
  includeDocumentation: z.boolean().default(true),
  includeExamples: z.boolean().default(true),
  installDependencies: z.boolean().default(true),
  initializeGit: z.boolean().default(true),
  createFirstCommit: z.boolean().default(false),
  outputFormat: OutputFormatEnum,
}).default({
  includeTests: true,
  includeDocumentation: true,
  includeExamples: true,
  installDependencies: true,
  initializeGit: true,
  createFirstCommit: false,
  outputFormat: "zip",
});

// API Schemas
export const CreateProjectSchema = z.object({
  templateId: z.string(),
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  variables: z.record(z.unknown()),
  generationConfig: GenerationConfigSchema,
  teamId: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: ProjectStatusEnum.optional(),
  deploymentUrl: z.string().optional(),
  repositoryUrl: z.string().optional(),
});

export const GetProjectSchema = z.object({
  id: z.string(),
});

export const ListProjectsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  status: ProjectStatusEnum.optional(),
  teamId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]),
}).transform(data => ({ ...data, sortOrder: data.sortOrder || "desc" }));

export const DeleteProjectSchema = z.object({
  id: z.string(),
});

export const DeployProjectSchema = z.object({
  projectId: z.string(),
  platform: z.enum(["vercel", "netlify", "railway", "github"]),
  environmentVariables: z.record(z.string()).optional(),
  autoDeploy: z.boolean(),
});

export const GetProjectLogsSchema = z.object({
  projectId: z.string(),
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  level: z.enum(["debug", "info", "warn", "error"]).optional(),
}).transform(data => ({
  ...data,
  page: data.page || 1,
  limit: data.limit || 50
}));

export const RetryProjectSchema = z.object({
  projectId: z.string(),
  variables: z.record(z.unknown()).optional(),
});

export const ArchiveProjectSchema = z.object({
  projectId: z.string(),
});

export const GetProjectAnalyticsSchema = z.object({
  projectId: z.string(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Project file schemas
export const CreateProjectFileSchema = z.object({
  projectId: z.string(),
  path: z.string(),
  content: z.string(),
  type: z.enum(["file", "directory"]),
  size: z.number().optional(),
  checksum: z.string().optional(),
});

export const UpdateProjectFileSchema = z.object({
  content: z.string().optional(),
  size: z.number().optional(),
  checksum: z.string().optional(),
});

export const DeleteProjectFileSchema = z.object({
  id: z.string(),
});

// Response schemas
export const ProjectResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: ProjectStatusEnum,
  userId: z.string(),
  teamId: z.string().nullable(),
  templateId: z.string(),
  variables: z.record(z.unknown()),
  generationConfig: GenerationConfigSchema,
  jobId: z.string().nullable(),
  repositoryUrl: z.string().nullable(),
  deploymentUrl: z.string().nullable(),
  downloadUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
  duration: z.number().nullable(), // in seconds
  outputFormat: OutputFormatEnum,
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  team: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  template: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    stack: z.any(),
  }),
  files: z.array(z.object({
    id: z.string(),
    path: z.string(),
    type: z.enum(["file", "directory"]),
    size: z.number().nullable(),
    checksum: z.string().nullable(),
    createdAt: z.date(),
  })),
});

export const ProjectListResponseSchema = z.object({
  projects: z.array(ProjectResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const ProjectAnalyticsSchema = z.object({
  projectId: z.string(),
  downloads: z.number(),
  views: z.number(),
  deployments: z.number(),
  buildTime: z.number(),
  successRate: z.number(),
  errorRate: z.number(),
  dailyStats: z.array(z.object({
    date: z.string(),
    downloads: z.number(),
    views: z.number(),
    deployments: z.number(),
  })),
  popularFiles: z.array(z.object({
    path: z.string(),
    downloads: z.number(),
  })),
  errorBreakdown: z.array(z.object({
    error: z.string(),
    count: z.number(),
    percentage: z.number(),
  })),
});

export const ProjectLogSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  level: z.enum(["debug", "info", "warn", "error"]),
  message: z.string(),
  metadata: z.record(z.unknown()).optional(),
  timestamp: z.date(),
});

export const ProjectLogListSchema = z.object({
  logs: z.array(ProjectLogSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const ProjectJobProgressSchema = z.object({
  jobId: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  progress: z.number().min(0).max(100),
  currentStep: z.string(),
  totalSteps: z.number(),
  logs: z.array(z.string()),
  startTime: z.date(),
  estimatedCompletion: z.date().nullable(),
  completedAt: z.date().nullable(),
  error: z.string().nullable(),
});

// Export types
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ListProjectsInput = z.infer<typeof ListProjectsSchema>;
export type DeployProjectInput = z.infer<typeof DeployProjectSchema>;
export type GetProjectLogsInput = z.infer<typeof GetProjectLogsSchema>;
export type RetryProjectInput = z.infer<typeof RetryProjectSchema>;
export type ArchiveProjectInput = z.infer<typeof ArchiveProjectSchema>;
export type GetProjectAnalyticsInput = z.infer<typeof GetProjectAnalyticsSchema>;

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
export type ProjectAnalytics = z.infer<typeof ProjectAnalyticsSchema>;
export type ProjectLog = z.infer<typeof ProjectLogSchema>;
export type ProjectLogList = z.infer<typeof ProjectLogListSchema>;
export type ProjectJobProgress = z.infer<typeof ProjectJobProgressSchema>;
export type GenerationConfig = z.infer<typeof GenerationConfigSchema>;
