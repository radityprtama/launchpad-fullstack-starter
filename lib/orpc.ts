import { procedures } from "@/lib/procedures";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Simple oRPC router implementation
export class ORPCRouter {
  private routes: Map<string, { input?: z.ZodSchema; resolve: (params: { input: unknown; ctx: Record<string, unknown> }) => Promise<unknown> }> = new Map();

  constructor() {
    this.registerProcedures();
  }

  private registerProcedures() {
    Object.entries(procedures).forEach(([name, procedure]) => {
      this.routes.set(name, procedure);
    });
  }

  async handleRequest(route: string, input: unknown, ctx?: Record<string, unknown>) {
    const procedure = this.routes.get(route);

    if (!procedure) {
      throw new Error(`Procedure '${route}' not found`);
    }

    // Validate input
    if (procedure.input && procedure.input !== z.void()) {
      const validatedInput = procedure.input.parse(input);
      return await procedure.resolve({ input: validatedInput, ctx: ctx || {} });
    }

    return await procedure.resolve({ input, ctx: ctx || {} });
  }

  getAvailableRoutes() {
    return Array.from(this.routes.keys());
  }
}

export const orpcRouter = new ORPCRouter();

// Middleware for authentication
export async function createContext(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    user: session?.user || null,
    req,
  };
}

// API route handler
export async function POST(req: Request) {
  try {
    const { route, input } = await req.json();
    const ctx = await createContext(req);

    if (!route) {
      return Response.json(
        { error: "Route is required" },
        { status: 400 }
      );
    }

    const result = await orpcRouter.handleRequest(route, input, ctx);

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("oRPC Error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}
