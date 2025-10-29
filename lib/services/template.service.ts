import { db } from "@/db";
import {
  template,
  templateStar,
  templateVersion,
  user,
  team,
} from "@/db/schema";
import { eq, desc, asc, ilike, and, or, sql, count } from "drizzle-orm";
import {
  CreateTemplateInput,
  UpdateTemplateInput,
  ListTemplatesInput,
  TemplateResponse,
  TemplateListResponse,
  TemplateVersion,
  StarTemplateInput,
  GenerateProjectInput,
  CreateTemplateVersionInput,
} from "@/lib/schemas/templates";
import {
  ProjectJobProgress,
} from "@/lib/schemas/projects";
import { randomUUID } from "crypto";
// Import queue when needed
// import { BackgroundJobQueue } from "@/lib/queue";
const BackgroundJobQueue = {
  add: async (type: string, data: Record<string, unknown>) => {
    const jobId = Math.random().toString(36).substring(7);
    console.log(`Mock queue job added: ${type}`, data);
    return { jobId };
  }
};

export class TemplateService {
  /**
   * Create a new template
   */
  async createTemplate(userId: string, input: CreateTemplateInput): Promise<TemplateResponse> {
    const templateId = randomUUID();
    const now = new Date();

    // Check if slug is unique
    const existingTemplate = await db
      .select()
      .from(template)
      .where(eq(template.slug, input.slug))
      .limit(1);

    if (existingTemplate.length > 0) {
      throw new Error("Template slug already exists");
    }

    // Create template
    const [newTemplate] = await db
      .insert(template)
      .values({
        id: templateId,
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        category: input.category,
        userId: userId,
        teamId: null, // Can be extended for team templates
        visibility: input.visibility,
        isPublic: input.visibility === "public",
        isOfficial: false, // Only admins can set this
        stack: input.stack,
        variables: input.variables,
        fileStructure: input.fileStructure,
        readme: input.readme || null,
        tags: input.tags,
        currentVersion: "1.0.0",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Create initial version
    await this.createTemplateVersion(templateId, {
      templateId,
      version: "1.0.0",
      stack: input.stack,
      variables: input.variables,
      fileStructure: input.fileStructure,
      readme: input.readme,
      isLatest: true,
      isStable: true,
    });

    return this.mapToTemplateResponse(newTemplate);
  }

  /**
   * Update an existing template
   */
  async updateTemplate(
    userId: string,
    templateId: string,
    input: UpdateTemplateInput
  ): Promise<TemplateResponse> {
    const now = new Date();

    // Check ownership
    const existing = await db
      .select()
      .from(template)
      .where(and(eq(template.id, templateId), eq(template.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      throw new Error("Template not found or access denied");
    }

    // Update slug uniqueness if changed
    if (input.slug && input.slug !== existing[0].slug) {
      const slugExists = await db
        .select()
        .from(template)
        .where(and(
          eq(template.slug, input.slug),
          sql`${template.id} != ${templateId}`
        ))
        .limit(1);

      if (slugExists.length > 0) {
        throw new Error("Template slug already exists");
      }
    }

    const [updatedTemplate] = await db
      .update(template)
      .set({
        ...input,
        updatedAt: now,
      })
      .where(eq(template.id, templateId))
      .returning();

    return this.mapToTemplateResponse(updatedTemplate);
  }

  /**
   * Get a template by ID
   */
  async getTemplate(templateId: string, userId?: string): Promise<TemplateResponse> {
    const result = await db
      .select({
        template: template,
        user: user,
        team: team,
      })
      .from(template)
      .leftJoin(user, eq(template.userId, user.id))
      .leftJoin(team, eq(template.teamId, team.id))
      .where(eq(template.id, templateId))
      .limit(1);

    if (result.length === 0) {
      throw new Error("Template not found");
    }

    const { template: templateData, user: userData, team: teamData } = result[0];

    // Check visibility permissions
    if (
      templateData.visibility === "private" &&
      userId !== templateData.userId
    ) {
      throw new Error("Access denied");
    }

    return this.mapToTemplateResponse({
      ...templateData,
      user: userData!,
      team: teamData,
    });
  }

  /**
   * List templates with filtering and pagination
   */
  async listTemplates(input: ListTemplatesInput, userId?: string): Promise<TemplateListResponse> {
    const offset = (input.page - 1) * input.limit;

    // Build query conditions
    const conditions = [
      sql`${template.deletedAt} IS NULL`,
    ];

    // Add visibility filters
    if (userId) {
      // Show public templates + user's own templates + team templates
      conditions.push(
        or(
          eq(template.isPublic, true),
          eq(template.userId, userId),
          // TODO: Add team visibility logic
        )
      );
    } else {
      // Only show public templates for non-authenticated users
      conditions.push(eq(template.isPublic, true));
    }

    // Add category filter
    if (input.category) {
      conditions.push(eq(template.category, input.category));
    }

    // Add search filter
    if (input.search) {
      conditions.push(
        or(
          ilike(template.name, `%${input.search}%`),
          ilike(template.description, `%${input.search}%`),
          ilike(template.tags, `%${input.search}%`)
        )
      );
    }

    // Add official filter
    if (input.isOfficial !== undefined) {
      conditions.push(eq(template.isOfficial, input.isOfficial));
    }

    // Add tags filter
    if (input.tags && input.tags.length > 0) {
      conditions.push(
        sql`${template.tags} && ${JSON.stringify(input.tags)}`
      );
    }

    // Build order by clause
    let orderBy;
    switch (input.sortBy) {
      case "downloads":
        orderBy = input.sortOrder === "asc"
          ? asc(template.downloads)
          : desc(template.downloads);
        break;
      case "stars":
        orderBy = input.sortOrder === "asc"
          ? asc(template.stars)
          : desc(template.stars);
        break;
      case "recent":
        orderBy = input.sortOrder === "asc"
          ? asc(template.updatedAt)
          : desc(template.updatedAt);
        break;
      case "popularity":
      default:
        // Custom popularity score: downloads * 0.7 + stars * 0.3
        orderBy = input.sortOrder === "asc"
          ? asc(sql`${template.downloads} * 0.7 + ${template.stars} * 0.3`)
          : desc(sql`${template.downloads} * 0.7 + ${template.stars} * 0.3`);
        break;
    }

    // Ensure orderBy is defined
    if (!orderBy) {
      orderBy = desc(template.updatedAt);
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(template)
      .where(and(...conditions));

    // Get templates
    const templatesResult = await db
      .select({
        template: template,
        user: user,
        team: team,
      })
      .from(template)
      .leftJoin(user, eq(template.userId, user.id))
      .leftJoin(team, eq(template.teamId, team.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(input.limit)
      .offset(offset);

    const templates = templatesResult.map(({ template: templateData, user: userData, team: teamData }) =>
      this.mapToTemplateResponse({
        ...templateData,
        user: userData!,
        team: teamData,
      })
    );

    const totalPages = Math.ceil(total / input.limit);

    return {
      templates,
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
   * Delete a template (soft delete)
   */
  async deleteTemplate(userId: string, templateId: string): Promise<void> {
    const existing = await db
      .select()
      .from(template)
      .where(and(eq(template.id, templateId), eq(template.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      throw new Error("Template not found or access denied");
    }

    await db
      .update(template)
      .set({ deletedAt: new Date() })
      .where(eq(template.id, templateId));
  }

  /**
   * Star/unstar a template
   */
  async toggleTemplateStar(userId: string, input: StarTemplateInput): Promise<boolean> {
    const existing = await db
      .select()
      .from(templateStar)
      .where(and(
        eq(templateStar.templateId, input.templateId),
        eq(templateStar.userId, userId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Remove star
      await db
        .delete(templateStar)
        .where(and(
          eq(templateStar.templateId, input.templateId),
          eq(templateStar.userId, userId)
        ));

      // Decrement star count
      await db
        .update(template)
        .set({
          stars: sql`${template.stars} - 1`
        })
        .where(eq(template.id, input.templateId));

      return false;
    } else {
      // Add star
      await db
        .insert(templateStar)
        .values({
          id: randomUUID(),
          templateId: input.templateId,
          userId: userId,
          createdAt: new Date(),
        });

      // Increment star count
      await db
        .update(template)
        .set({
          stars: sql`${template.stars} + 1`
        })
        .where(eq(template.id, input.templateId));

      return true;
    }
  }

  /**
   * Create a new template version
   */
  async createTemplateVersion(
    templateId: string,
    input: Omit<CreateTemplateVersionInput, 'createdBy'>
  ): Promise<TemplateVersion> {
    const versionId = randomUUID();
    const now = new Date();

    // If this is marked as latest, update other versions
    if (input.isLatest) {
      await db
        .update(templateVersion)
        .set({ isLatest: false })
        .where(eq(templateVersion.templateId, templateId));
    }

    const [newVersion] = await db
      .insert(templateVersion)
      .values({
        id: versionId,
        templateId: input.templateId,
        version: input.version,
        name: input.name || null,
        description: input.description || null,
        stack: input.stack,
        variables: input.variables,
        fileStructure: input.fileStructure,
        readme: input.readme || null,
        changelog: input.changelog || null,
        isLatest: input.isLatest,
        isStable: input.isStable,
        createdBy: "system", // TODO: Get from context
        createdAt: now,
      })
      .returning();

    return this.mapToTemplateVersion(newVersion);
  }

  /**
   * Generate a project from a template
   */
  async generateProject(userId: string, input: GenerateProjectInput): Promise<{ jobId: string }> {
    // Get template
    const templateData = await this.getTemplate(input.templateId, userId);

    // Validate variables
    this.validateTemplateVariables(templateData.variables, input.variables);

    // Create background job
    const jobId = randomUUID();

    await BackgroundJobQueue.add("project-generation", {
      jobId,
      userId,
      templateId: input.templateId,
      projectName: input.projectName,
      variables: input.variables,
      deploymentPlatform: input.deploymentPlatform,
    });

    return { jobId };
  }

  /**
   * Get project generation progress
   */
  async getProjectGenerationProgress(jobId: string): Promise<ProjectJobProgress> {
    // This would typically query a jobs table or use Redis for real-time updates
    // For now, return mock data
    return {
      jobId,
      status: "running",
      progress: 45,
      currentStep: "Installing dependencies",
      totalSteps: 8,
      logs: [
        "Starting project generation...",
        "Template loaded successfully",
        "Variables validated",
        "Creating project structure...",
        "Installing dependencies..."
      ],
      startTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      estimatedCompletion: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
      completedAt: null,
      error: null,
    };
  }

  /**
   * Validate template variables against provided values
   */
  private validateTemplateVariables(
    templateVariables: Array<{
      name: string;
      type: string;
      required: boolean;
      options?: string[];
    }>,
    providedVariables: Record<string, unknown>
  ): void {
    for (const variable of templateVariables) {
      const value = providedVariables[variable.name];

      if (variable.required && (value === undefined || value === null || value === "")) {
        throw new Error(`Required variable '${variable.name}' is missing`);
      }

      if (value !== undefined) {
        // Type validation
        switch (variable.type) {
          case "string":
            if (typeof value !== "string") {
              throw new Error(`Variable '${variable.name}' must be a string`);
            }
            break;
          case "number":
            if (typeof value !== "number") {
              throw new Error(`Variable '${variable.name}' must be a number`);
            }
            break;
          case "boolean":
            if (typeof value !== "boolean") {
              throw new Error(`Variable '${variable.name}' must be a boolean`);
            }
            break;
          case "select":
            if (variable.options && !variable.options.includes(value)) {
              throw new Error(`Variable '${variable.name}' must be one of: ${variable.options.join(", ")}`);
            }
            break;
        }
      }
    }
  }

  /**
   * Map database template to response format
   */
  private mapToTemplateResponse(data: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    visibility: string;
    isOfficial: boolean;
    isPublic: boolean;
    stack: Record<string, unknown>;
    variables: Array<Record<string, unknown>>;
    fileStructure: Array<Record<string, unknown>>;
    readme: string | null;
    tags: string[];
    downloads: number;
    stars: number;
    forks: number;
    currentVersion: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    user?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    team?: {
      id: string;
      name: string;
    } | null;
  }): TemplateResponse {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category as "frontend" | "backend" | "fullstack" | "mobile" | "desktop" | "cli" | "other",
      visibility: data.visibility as "private" | "team" | "public",
      isOfficial: data.isOfficial,
      isPublic: data.isPublic,
      stack: data.stack as {
        framework?: string;
        language?: string;
        database?: string;
        styling?: string;
        testing?: string[];
        deployment?: string[];
      },
      variables: data.variables as Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
        defaultValue?: unknown;
        options?: string[];
      }>,
      fileStructure: data.fileStructure as Array<{
        path: string;
        content: string;
        type: string;
        executable?: boolean;
      }>,
      readme: data.readme,
      tags: data.tags,
      downloads: data.downloads,
      stars: data.stars,
      forks: data.forks,
      currentVersion: data.currentVersion,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      user: data.user ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      } : null,
      team: data.team ? {
        id: data.team.id,
        name: data.team.name,
      } : null,
    };
  }

  /**
   * Map database template version to response format
   */
  private mapToTemplateVersion(data: {
    id: string;
    templateId: string;
    version: string;
    name: string | null;
    description: string | null;
    stack: Record<string, unknown>;
    variables: Array<Record<string, unknown>>;
    fileStructure: Array<Record<string, unknown>>;
    readme: string | null;
    changelog: string | null;
    isLatest: boolean;
    isStable: boolean;
    createdBy: string;
    createdAt: Date;
  }): TemplateVersion {
    return {
      id: data.id,
      templateId: data.templateId,
      version: data.version,
      name: data.name,
      description: data.description,
      stack: data.stack as {
        framework?: string;
        language?: string;
        database?: string;
        styling?: string;
        testing?: string[];
        deployment?: string[];
      },
      variables: data.variables as Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
        defaultValue?: unknown;
        options?: string[];
      }>,
      fileStructure: data.fileStructure as Array<{
        path: string;
        content: string;
        type: string;
        executable?: boolean;
      }>,
      readme: data.readme,
      changelog: data.changelog,
      isLatest: data.isLatest,
      isStable: data.isStable,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    };
  }
}

export const templateService = new TemplateService();
