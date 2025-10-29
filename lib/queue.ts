import { randomUUID } from "crypto";

export interface BackgroundJob {
  id: string;
  type: string;
  data: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: Record<string, unknown>;
  progress?: number;
  logs: string[];
}

// Simple in-memory job queue (in production, use Redis or Bull Queue)
class BackgroundJobQueueImpl {
  private jobs: Map<string, BackgroundJob> = new Map();
  private processing = false;

  async add(type: string, data: Record<string, unknown>): Promise<string> {
    const jobId = randomUUID();
    const job: BackgroundJob = {
      id: jobId,
      type,
      data,
      status: "pending",
      createdAt: new Date(),
      logs: [],
    };

    this.jobs.set(jobId, job);
    this.startProcessing();

    return jobId;
  }

  async getStatus(jobId: string): Promise<BackgroundJob | null> {
    return this.jobs.get(jobId) || null;
  }

  private async startProcessing() {
    if (this.processing) return;
    this.processing = true;

    while (this.hasPendingJobs()) {
      const pendingJob = this.getNextPendingJob();
      if (!pendingJob) break;

      await this.processJob(pendingJob);
    }

    this.processing = false;
  }

  private hasPendingJobs(): boolean {
    return Array.from(this.jobs.values()).some(job => job.status === "pending");
  }

  private getNextPendingJob(): BackgroundJob | null {
    for (const job of this.jobs.values()) {
      if (job.status === "pending") {
        return job;
      }
    }
    return null;
  }

  private async processJob(job: BackgroundJob) {
    job.status = "running";
    job.startedAt = new Date();
    job.logs.push(`Starting job: ${job.type}`);

    try {
      switch (job.type) {
        case "project-generation":
          await this.processProjectGeneration(job);
          break;
        case "template-validation":
          await this.processTemplateValidation(job);
          break;
        case "deployment":
          await this.processDeployment(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      job.status = "completed";
      job.completedAt = new Date();
      job.logs.push(`Job completed successfully`);
    } catch (error) {
      job.status = "failed";
      job.completedAt = new Date();
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.logs.push(`Job failed: ${job.error}`);
    }
  }

  private async processProjectGeneration(job: BackgroundJob) {
    const { projectName, deploymentPlatform } = job.data as {
      projectName: string;
      deploymentPlatform: string;
      userId?: string;
      templateId?: string;
      variables?: Record<string, unknown>;
    };

    job.logs.push("Loading template...");
    await this.simulateWork(1000);
    job.progress = 10;

    job.logs.push("Validating variables...");
    await this.simulateWork(500);
    job.progress = 20;

    job.logs.push("Creating project structure...");
    await this.simulateWork(2000);
    job.progress = 40;

    job.logs.push("Generating files from template...");
    await this.simulateWork(3000);
    job.progress = 60;

    job.logs.push("Installing dependencies...");
    await this.simulateWork(2000);
    job.progress = 80;

    job.logs.push("Building project...");
    await this.simulateWork(1000);
    job.progress = 90;

    job.logs.push("Preparing download...");
    await this.simulateWork(500);
    job.progress = 100;

    // Mock result
    job.result = {
      projectId: randomUUID(),
      downloadUrl: `https://launchpad.dev/downloads/${randomUUID()}.zip`,
      deploymentUrl: deploymentPlatform === "vercel"
        ? `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
        : null,
    };
  }

  private async processTemplateValidation(job: BackgroundJob) {
    job.logs.push("Validating template structure...");
    await this.simulateWork(1000);
    job.progress = 50;

    job.logs.push("Checking required files...");
    await this.simulateWork(1000);
    job.progress = 100;

    job.result = { valid: true };
  }

  private async processDeployment(job: BackgroundJob) {
    const { projectId, platform } = job.data as {
      projectId: string;
      platform: string;
    };

    job.logs.push(`Preparing deployment to ${platform}...`);
    await this.simulateWork(2000);
    job.progress = 30;

    job.logs.push("Building application...");
    await this.simulateWork(3000);
    job.progress = 60;

    job.logs.push("Deploying to platform...");
    await this.simulateWork(4000);
    job.progress = 90;

    job.logs.push("Deployment completed!");
    await this.simulateWork(500);
    job.progress = 100;

    job.result = {
      deploymentUrl: `https://${projectId}.${platform}.com`,
      status: "deployed",
    };
  }

  private async simulateWork(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup old jobs (call this periodically)
  cleanup(maxAge: number = 24 * 60 * 60 * 1000) { // 24 hours
    const cutoff = new Date(Date.now() - maxAge);

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt < cutoff && (job.status === "completed" || job.status === "failed")) {
        this.jobs.delete(jobId);
      }
    }
  }
}

export const BackgroundJobQueue = new BackgroundJobQueueImpl();

// Auto-cleanup every hour
setInterval(() => {
  BackgroundJobQueue.cleanup();
}, 60 * 60 * 1000);
