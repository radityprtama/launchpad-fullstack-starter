import { db } from "@/db";
import {
  project,
  projectFile,
  projectAnalytics,
  user,
  team,
  template,
} from "@/db/schema";
import { eq, desc, asc, ilike, and, or, count } from "drizzle-orm";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsInput,
  DeployProjectInput,
  GetProjectLogsInput,
  RetryProjectInput,

  GetProjectAnalyticsInput,
  ProjectResponse,
  ProjectListResponse,
  ProjectLogList,
  ProjectAnalytics,
  GenerationConfig,
} from "@/lib/schemas/projects";
import { randomUUID } from "crypto";
import { BackgroundJobQueue } from "@/lib/queue";

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(userId: string, input: CreateProjectInput): Promise<ProjectResponse> {
    const projectId = randomUUID();
    const now = new Date();

    // Validate template exists and user has access
    // For now, skip this check and assume template exists

    // Create project record
    const [newProject] = await db
      .insert(project)
      .values({
        name: input.projectName,
        description: input.description || null,
        userId: userId,
        teamId: input.teamId || null,
        templateId: input.templateId,
        variables: input.variables,
        generationConfig: {
          templateId: input.templateId,
          variables: input.variables,
          outputFormat: input.generationConfig.outputFormat === "direct-deploy" ? "download" : "download",
          repositoryConfig: undefined,
        } as any,
        status: "pending",
        outputFormat: input.generationConfig.outputFormat === "direct-deploy" ? "download" : "download",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Start background job for project generation
    const { jobId } = await BackgroundJobQueue.add("project-generation", {
      userId,
      templateId: input.templateId,
      projectName: input.projectName,
      variables: input.variables,
      deploymentPlatform: input.generationConfig.outputFormat === "direct-deploy" ? "vercel" : "other",
    });

    // Update project with job ID
    await db
      .update(project)
      .set({ jobId })
      .where(eq(project.id, projectId));

    return this.mapToProjectResponse({
      ...newProject,
      jobId,
    });
  }

  /**
   * Update an existing project
   */
  async updateProject(
    userId: string,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<ProjectResponse> {
    const now = new Date();

    // Check ownership
    const existing = await db
      .select()
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      throw new Error("Project not found or access denied");
    }

    const [updatedProject] = await db
      .update(project)
      .set({
        ...input,
        updatedAt: now,
      })
      .where(eq(project.id, projectId))
      .returning();

    return this.mapToProjectResponse(updatedProject);
  }

  /**
   * Get a project by ID
   */
  async getProject(userId: string, projectId: string): Promise<ProjectResponse> {
    const result = await db
      .select({
        project: project,
        user: user,
        team: team,
        template: template,
      })
      .from(project)
      .leftJoin(user, eq(project.userId, user.id))
      .leftJoin(team, eq(project.teamId, team.id))
      .leftJoin(template, eq(project.templateId, template.id))
      .where(and(eq(project.id, projectId), eq(project.userId, userId)))
      .limit(1);

    if (result.length === 0) {
      throw new Error("Project not found or access denied");
    }

    const { project: projectData, user: userData, team: teamData, template: templateData } = result[0];

    // Get project files
    const files = await db
      .select()
      .from(projectFile)
      .where(eq(projectFile.projectId, projectId))
      .orderBy(projectFile.path);

    return this.mapToProjectResponse({
      ...projectData,
      user: userData!,
      team: teamData,
      template: templateData!,
      files,
    });
  }

  /**
   * List projects with filtering and pagination
   */
  async listProjects(userId: string, input: ListProjectsInput): Promise<ProjectListResponse> {
    const offset = (input.page - 1) * input.limit;

    // Build query conditions
    const conditions = [
      eq(project.userId, userId),
    ];

    // Add team filter if specified
    if (input.teamId) {
      conditions.push(eq(project.teamId, input.teamId));
    }

    // Add status filter - map schema status to db status
    if (input.status) {
      const statusMap: Record<string, "pending" | "processing" | "completed" | "failed" | "cancelled"> = {
        "draft": "pending",
        "building": "processing",
        "deployed": "completed",
        "failed": "failed",
        "archived": "cancelled"
      };
      conditions.push(eq(project.status, statusMap[input.status] || "pending"));
    }

    // Add search filter
    if (input.search) {
      conditions.push(
        or(
          ilike(project.name, `%${input.search}%`),
          ilike(project.description, `%${input.search}%`)
        )
      );
    }

    // Build order by clause
    let orderBy;
    switch (input.sortBy) {
      case "name":
        orderBy = input.sortOrder === "asc" ? asc(project.name) : desc(project.name);
        break;
      case "status":
        orderBy = input.sortOrder === "asc" ? asc(project.status) : desc(project.status);
        break;
      case "updatedAt":
        orderBy = input.sortOrder === "asc" ? asc(project.updatedAt) : desc(project.updatedAt);
        break;
      case "createdAt":
      default:
        orderBy = input.sortOrder === "asc" ? asc(project.createdAt) : desc(project.createdAt);
        break;
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(project)
      .where(and(...conditions));

    // Get projects
    const projectsResult = await db
      .select({
        project: project,
        user: user,
        team: team,
        template: template,
      })
      .from(project)
      .leftJoin(user, eq(project.userId, user.id))
      .leftJoin(team, eq(project.teamId, team.id))
      .leftJoin(template, eq(project.templateId, template.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(input.limit)
      .offset(offset);

    const projects = projectsResult.map(({ project: projectData, user: userData, team: teamData, template: templateData }) =>
      this.mapToProjectResponse({
        ...projectData,
        user: userData!,
        team: teamData,
        template: templateData!,
        files: [], // Don't include files in list view for performance
      })
    );

    const totalPages = Math.ceil(total / input.limit);

    return {
      projects,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages,
        hasNext: input.page < totalPages,
        hasPrev: input.page > 1,
      },
    };
  }

  /**
   * Delete a project
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    const existing = await db
      .select()
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      throw new Error("Project not found or access denied");
    }

    // Delete related records (cascade delete should handle this, but being explicit)
    await db.delete(projectFile).where(eq(projectFile.projectId, projectId));
    await db.delete(projectAnalytics).where(eq(projectAnalytics.projectId, projectId));
    // await db.delete(projectLog).where(eq(projectLog.projectId, projectId)); // TODO: Implement projectLog table

    await db.delete(project).where(eq(project.id, projectId));
  }

  /**
   * Deploy a project
   */
  async deployProject(userId: string, input: DeployProjectInput): Promise<{ deploymentUrl: string; jobId: string }> {
    // Check project ownership and status
    const projectData = await this.getProject(userId, input.projectId);

    if (projectData.status !== "deployed") {
      throw new Error("Project must be completed before deployment");
    }

    // Start deployment job
    const { jobId } = await BackgroundJobQueue.add("deployment", {
      projectId: input.projectId,
      platform: input.platform,
      environmentVariables: input.environmentVariables,
      autoDeploy: input.autoDeploy,
    });

    // Update project status
    await db
      .update(project)
      .set({
        status: "processing",
        updatedAt: new Date(),
        jobId: jobId,
      })
      .where(eq(project.id, input.projectId));

    return {
      deploymentUrl: `https://${projectData.name.toLowerCase().replace(/\s+/g, '-')}.${input.platform}.com`,
      jobId,
    };
  }

  /**
   * Get project logs
   */
  async getProjectLogs(userId: string, input: GetProjectLogsInput): Promise<ProjectLogList> {
    // Check project ownership
    await this.getProject(userId, input.projectId);

    // TODO: Implement projectLog table and proper log storage
    // For now, return mock data
    const mockLogs = [
      {
        id: "1",
        projectId: input.projectId,
        level: "info" as const,
        message: "Project generation started",
        timestamp: new Date(),
      },
      {
        id: "2",
        projectId: input.projectId,
        level: "info" as const,
        message: "Template loaded successfully",
        timestamp: new Date(),
      },
    ];

    return {
      logs: mockLogs,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: mockLogs.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  /**
   * Retry a failed project generation
   */
  async retryProject(userId: string, input: RetryProjectInput): Promise<{ jobId: string }> {
    const projectData = await this.getProject(userId, input.projectId);

    if (projectData.status !== "failed") {
      throw new Error("Only failed projects can be retried");
    }

    // Start new generation job
    const { jobId } = await BackgroundJobQueue.add("project-generation", {
      userId,
      templateId: projectData.template.id,
      projectName: projectData.name,
      variables: input.variables || projectData.variables,
      deploymentPlatform: "other",
    });

    // Update project status and job ID
    await db
      .update(project)
      .set({
        status: "processing",
        updatedAt: new Date(),
        jobId,
        completedAt: null,
        duration: null,
      })
      .where(eq(project.id, input.projectId));

    return { jobId };
  }

  /**
   * Archive a project
   */
  async archiveProject(userId: string, projectId: string): Promise<void> {
    // Update project status directly to avoid schema mismatch
    await db
      .update(project)
      .set({
        status: "cancelled",
        updatedAt: new Date()
      })
      .where(and(eq(project.id, projectId), eq(project.userId, userId)));
  }

  /**
   * Get project analytics
   */
  async getProjectAnalytics(userId: string, input: GetProjectAnalyticsInput): Promise<ProjectAnalytics> {
    // Check project ownership
    await this.getProject(userId, input.projectId);

    // For now, return mock analytics data
    // In a real implementation, this would query the analytics table
    return {
      projectId: input.projectId,
      downloads: 452,
      views: 1284,
      deployments: 8,
      buildTime: 120, // seconds
      successRate: 94.5,
      errorRate: 5.5,
      dailyStats: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        downloads: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 200),
        deployments: Math.floor(Math.random() * 5),
      })),
      popularFiles: [
        { path: "/package.json", downloads: 452 },
        { path: "/README.md", downloads: 387 },
        { path: "/src/app/page.tsx", downloads: 298 },
      ],
      errorBreakdown: [
        { error: "Dependency install failed", count: 2, percentage: 40 },
        { error: "Build timeout", count: 2, percentage: 40 },
        { error: "Configuration error", count: 1, percentage: 20 },
      ],
    };
  }

  /**
   * Map database project to response format
   */
  private mapToProjectResponse(data: {
    id: string;
    name: string;
    description: string | null;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    userId: string;
    teamId: string | null;
    templateId: string;
    variables: Record<string, unknown>;
    generationConfig: unknown;
    jobId: string | null;
    repositoryUrl: string | null;
    deploymentUrl: string | null;
    downloadUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
    duration: number | null;
    outputFormat: "download" | "github" | "gitlab";
    user?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    team?: {
      id: string;
      name: string;
    } | null;
    template?: {
      id: string;
      name: string;
      category: string;
      stack: unknown;
    } | null;
    files?: Array<{
      id: string;
      path: string;
      type: string;
      size: number | null;
      checksum: string | null;
      createdAt: Date;
    }>;
  }): ProjectResponse {
    // Map db status to schema status
    const statusMap: Record<string, "draft" | "building" | "deployed" | "failed" | "archived"> = {
      "pending": "draft",
      "processing": "building",
      "completed": "deployed",
      "failed": "failed",
      "cancelled": "archived"
    };

    // Map db outputFormat to schema outputFormat
    const outputFormatMap: Record<string, "zip" | "git-repo" | "direct-deploy"> = {
      "download": "zip",
      "github": "git-repo",
      "gitlab": "git-repo"
    };

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      status: statusMap[data.status] || "draft",
      userId: data.userId,
      teamId: data.teamId,
      templateId: data.templateId,
      variables: data.variables,
      generationConfig: data.generationConfig as GenerationConfig,
      jobId: data.jobId,
      repositoryUrl: data.repositoryUrl,
      deploymentUrl: data.deploymentUrl,
      downloadUrl: data.downloadUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt,
      duration: data.duration,
      outputFormat: outputFormatMap[data.outputFormat] || "zip",
      user: data.user ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      } : null,
      team: data.team ? {
        id: data.team.id,
        name: data.team.name,
      } : null,
      template: data.template ? {
        id: data.template.id,
        name: data.template.name,
        category: data.template.category,
        stack: data.template.stack,
      } : null,
      files: data.files?.map((file: any) => ({
        ...file,
        type: file.type as "file" | "directory"
      })) || [],
    };
  }
}

export const projectService = new ProjectService();
