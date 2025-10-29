import { z } from "zod";
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  ListTemplatesSchema,
  StarTemplateSchema,
  GenerateProjectSchema,
  CreateTemplateVersionSchema,
} from "@/lib/schemas/templates";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ListProjectsSchema,
  DeployProjectSchema,
  GetProjectLogsSchema,
  RetryProjectSchema,
  ArchiveProjectSchema,
  GetProjectAnalyticsSchema,
} from "@/lib/schemas/projects";
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  ListTemplatesInput,
  StarTemplateInput,
  GenerateProjectInput,
  CreateTemplateVersionInput,
  CreateProjectInput as CreateProjectInputType,
  UpdateProjectInput as UpdateProjectInputType,
  ListProjectsInput,
  DeployProjectInput,
  GetProjectLogsInput,
  RetryProjectInput,
  ArchiveProjectInput,
  GetProjectAnalyticsInput,
} from "@/lib/schemas";
import { templateService } from "@/lib/services/template.service";
import { projectService } from "@/lib/services/project.service";

// Context type
interface Context {
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  req: Request;
}

// Template Procedures
export const createTemplate = {
  input: CreateTemplateSchema,
  resolve: async ({ input, ctx }: { input: CreateTemplateInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await templateService.createTemplate(ctx.user.id, input);
  },
};

export const updateTemplate = {
  input: UpdateTemplateSchema,
  resolve: async ({ input, ctx }: { input: UpdateTemplateInput & { id: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    const { id, ...updateData } = input;
    return await templateService.updateTemplate(ctx.user.id, id, updateData);
  },
};

export const getTemplate = {
  input: z.object({ id: z.string() }),
  resolve: async ({ input, ctx }: { input: { id: string }; ctx: Context }) => {
    return await templateService.getTemplate(input.id, ctx.user?.id);
  },
};

export const listTemplates = {
  input: ListTemplatesSchema,
  resolve: async ({ input, ctx }: { input: ListTemplatesInput; ctx: Context }) => {
    return await templateService.listTemplates(input, ctx.user?.id);
  },
};

export const deleteTemplate = {
  input: z.object({ id: z.string() }),
  resolve: async ({ input, ctx }: { input: { id: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    await templateService.deleteTemplate(ctx.user.id, input.id);
    return { success: true };
  },
};

export const starTemplate = {
  input: StarTemplateSchema,
  resolve: async ({ input, ctx }: { input: StarTemplateInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    const isStarred = await templateService.toggleTemplateStar(ctx.user.id, input);
    return { starred: isStarred };
  },
};

export const createTemplateVersion = {
  input: CreateTemplateVersionSchema,
  resolve: async ({ input, ctx }: { input: CreateTemplateVersionInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    // Check if user owns the template
    await templateService.getTemplate(input.templateId, ctx.user.id);

    return await templateService.createTemplateVersion(input.templateId, {
      ...input,
      createdBy: ctx.user.id,
    });
  },
};

export const generateProject = {
  input: GenerateProjectSchema,
  resolve: async ({ input, ctx }: { input: GenerateProjectInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await templateService.generateProject(ctx.user.id, input);
  },
};

export const getProjectGenerationProgress = {
  input: z.object({ jobId: z.string() }),
  resolve: async ({ input, ctx }: { input: { jobId: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await templateService.getProjectGenerationProgress(input.jobId);
  },
};

// Project Procedures
export const createProject = {
  input: CreateProjectSchema,
  resolve: async ({ input, ctx }: { input: CreateProjectInputType; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.createProject(ctx.user.id, input);
  },
};

export const updateProject = {
  input: UpdateProjectSchema,
  resolve: async ({ input, ctx }: { input: UpdateProjectInputType & { id: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    const { id, ...updateData } = input;
    return await projectService.updateProject(ctx.user.id, id, updateData);
  },
};

export const getProject = {
  input: z.object({ id: z.string() }),
  resolve: async ({ input, ctx }: { input: { id: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.getProject(ctx.user.id, input.id);
  },
};

export const listProjects = {
  input: ListProjectsSchema,
  resolve: async ({ input, ctx }: { input: ListProjectsInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.listProjects(ctx.user.id, input);
  },
};

export const deleteProject = {
  input: z.object({ id: z.string() }),
  resolve: async ({ input, ctx }: { input: { id: string }; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    await projectService.deleteProject(ctx.user.id, input.id);
    return { success: true };
  },
};

export const deployProject = {
  input: DeployProjectSchema,
  resolve: async ({ input, ctx }: { input: DeployProjectInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.deployProject(ctx.user.id, input);
  },
};

export const getProjectLogs = {
  input: GetProjectLogsSchema,
  resolve: async ({ input, ctx }: { input: GetProjectLogsInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.getProjectLogs(ctx.user.id, input);
  },
};

export const retryProject = {
  input: RetryProjectSchema,
  resolve: async ({ input, ctx }: { input: RetryProjectInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.retryProject(ctx.user.id, input);
  },
};

export const archiveProject = {
  input: ArchiveProjectSchema,
  resolve: async ({ input, ctx }: { input: ArchiveProjectInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    await projectService.archiveProject(ctx.user.id, input.projectId);
    return { success: true };
  },
};

export const getProjectAnalytics = {
  input: GetProjectAnalyticsSchema,
  resolve: async ({ input, ctx }: { input: GetProjectAnalyticsInput; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return await projectService.getProjectAnalytics(ctx.user.id, input);
  },
};

// User Procedures
export const getCurrentUser = {
  input: z.void(),
  resolve: async ({ ctx }: { ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    return ctx.user;
  },
};

export const updateUserProfile = {
  input: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().url().optional(),
  }),
  resolve: async ({ input, ctx }: { input: z.infer<typeof updateUserProfile.input>; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    // This would update the user profile in the database
    // For now, just return the updated user
    return {
      ...ctx.user,
      ...input,
    };
  },
};

// Team Procedures
export const getUserTeams = {
  input: z.void(),
  resolve: async ({ ctx }: { ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    // This would fetch teams from the database
    // For now, return mock data
    return [
      {
        id: "team-1",
        name: "Acme Development Team",
        role: "owner",
        members: 3,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "team-2",
        name: "Side Projects",
        role: "member",
        members: 5,
        createdAt: new Date("2024-02-15"),
      },
    ];
  },
};

export const createTeam = {
  input: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
  }),
  resolve: async ({ input, ctx }: { input: z.infer<typeof createTeam.input>; ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    // This would create a team in the database
    // For now, return mock data
    return {
      id: "new-team-id",
      name: input.name,
      slug: input.slug,
      description: input.description,
      role: "owner",
      members: 1,
      createdAt: new Date(),
    };
  },
};

// Analytics Procedures
export const getUserAnalytics = {
  input: z.object({
    dateRange: z.object({
      start: z.date().optional(),
      end: z.date().optional(),
    }).optional(),
  }),
  resolve: async ({ ctx }: { ctx: Context }) => {
    if (!ctx.user) {
      throw new Error("Authentication required");
    }

    // This would fetch real analytics data
    // For now, return mock data
    return {
      totalProjects: 12,
      totalDownloads: 2847,
      totalStars: 156,
      activeProjects: 8,
      popularTemplates: [
        { id: "1", name: "Next.js SaaS Starter", downloads: 452 },
        { id: "2", name: "E-commerce Store", downloads: 891 },
      ],
      recentActivity: [
        { type: "project_created", project: "Blog Platform", timestamp: new Date() },
        { type: "template_starred", template: "FastAPI Backend", timestamp: new Date() },
      ],
      dailyStats: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projects: Math.floor(Math.random() * 5),
        downloads: Math.floor(Math.random() * 200),
        stars: Math.floor(Math.random() * 20),
      })),
    };
  },
};

// Export all procedures
export const procedures = {
  // Templates
  createTemplate,
  updateTemplate,
  getTemplate,
  listTemplates,
  deleteTemplate,
  starTemplate,
  createTemplateVersion,
  generateProject,
  getProjectGenerationProgress,

  // Projects
  createProject,
  updateProject,
  getProject,
  listProjects,
  deleteProject,
  deployProject,
  getProjectLogs,
  retryProject,
  archiveProject,
  getProjectAnalytics,

  // User
  getCurrentUser,
  updateUserProfile,

  // Teams
  getUserTeams,
  createTeam,

  // Analytics
  getUserAnalytics,
};
