"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Database,
  Globe,
  Package,
  Play,
  Settings,
  Sparkles,
  Zap,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface TemplateVariable {
  name: string;
  label: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue: string | boolean | number;
  options?: string[];
}

interface FormData {
  project_name: string;
  database_url: string;
  stripe_secret_key: string;
  enable_analytics: boolean;
  deployment_platform: string;
  [key: string]: string | boolean | number;
}

interface ProjectStructureItem {
  path: string;
  name: string;
  type: string;
  children?: ProjectStructureItem[];
}

// Mock template data
const template = {
  id: "1",
  name: "Next.js SaaS Starter",
  description: "Production-ready SaaS boilerplate with authentication, billing, and dashboard",
  category: "fullstack",
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS", "Drizzle ORM"],
  image: "/api/placeholder/600/400",
  downloads: 15420,
  stars: 892,
  isOfficial: true,
  author: "LaunchPad Team",
  features: [
    "Next.js 15 with App Router",
    "TypeScript for type safety",
    "PostgreSQL with Drizzle ORM",
    "Stripe payment integration",
    "Better Auth authentication",
    "Tailwind CSS for styling",
    "API routes with tRPC",
    "Docker deployment ready",
  ],
  variables: [
    {
      name: "project_name",
      label: "Project Name",
      type: "string",
      description: "The name of your project",
      required: true,
      defaultValue: "my-saas-app",
    },
    {
      name: "database_url",
      label: "Database URL",
      type: "string",
      description: "Your PostgreSQL connection string",
      required: true,
      defaultValue: "postgresql://user:password@localhost:5432/myapp",
    },
    {
      name: "stripe_secret_key",
      label: "Stripe Secret Key",
      type: "string",
      description: "Your Stripe API secret key",
      required: false,
      defaultValue: "",
    },
    {
      name: "enable_analytics",
      label: "Enable Analytics",
      type: "boolean",
      description: "Include analytics tracking in the generated project",
      required: false,
      defaultValue: true,
    },
    {
      name: "deployment_platform",
      label: "Deployment Platform",
      type: "select",
      description: "Target platform for deployment",
      required: true,
      defaultValue: "vercel",
      options: ["vercel", "netlify", "railway", "other"],
    },
  ] satisfies TemplateVariable[],
};

const projectStructure: ProjectStructureItem[] = [
  {
    path: "/",
    name: "📁 project-root/",
    type: "directory",
    children: [
      {
        path: "/app",
        name: "📁 app/",
        type: "directory",
        children: [
          { path: "/app/page.tsx", name: "📄 page.tsx", type: "file" },
          { path: "/app/layout.tsx", name: "📄 layout.tsx", type: "file" },
          { path: "/app/auth", name: "📁 auth/", type: "directory" },
          { path: "/app/dashboard", name: "📁 dashboard/", type: "directory" },
          { path: "/app/api", name: "📁 api/", type: "directory" },
        ],
      },
      {
        path: "/components",
        name: "📁 components/",
        type: "directory",
        children: [
          { path: "/components/ui", name: "📁 ui/", type: "directory" },
          { path: "/components/auth", name: "📁 auth/", type: "directory" },
        ],
      },
      {
        path: "/lib",
        name: "📁 lib/",
        type: "directory",
        children: [
          { path: "/lib/db", name: "�� db/", type: "directory" },
          { path: "/lib/auth", name: "📁 auth/", type: "directory" },
        ],
      },
      { path: "/package.json", name: "📄 package.json", type: "file" },
      { path: "/tailwind.config.js", name: "📄 tailwind.config.js", type: "file" },
      { path: "/tsconfig.json", name: "📄 tsconfig.json", type: "file" },
      { path: "/Dockerfile", name: "📄 Dockerfile", type: "file" },
      { path: "/docker-compose.yml", name: "📄 docker-compose.yml", type: "file" },
    ],
  },
];



export default function TemplateGeneratePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    project_name: (template.variables.find(v => v.name === "project_name")?.defaultValue as string) || "",
    database_url: (template.variables.find(v => v.name === "database_url")?.defaultValue as string) || "",
    stripe_secret_key: (template.variables.find(v => v.name === "stripe_secret_key")?.defaultValue as string) || "",
    enable_analytics: (template.variables.find(v => v.name === "enable_analytics")?.defaultValue as boolean) || false,
    deployment_platform: (template.variables.find(v => v.name === "deployment_platform")?.defaultValue as string) || "vercel",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateFormData = (field: keyof FormData | string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate project generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    // Navigate to success page or download project
    alert("Project generated successfully! 🚀");
  };

  const renderFormField = (variable: TemplateVariable) => {
    const fieldValue = formData[variable.name as keyof FormData];

    switch (variable.type) {
      case "string":
        return (
          <Input
            value={typeof fieldValue === "string" ? fieldValue : ""}
            onChange={(e) => updateFormData(variable.name, e.target.value)}
            placeholder={typeof variable.defaultValue === "string" ? variable.defaultValue : ""}
            required={variable.required}
          />
        );
      case "text":
        return (
          <Textarea
            value={typeof fieldValue === "string" ? fieldValue : ""}
            onChange={(e) => updateFormData(variable.name, e.target.value)}
            placeholder={typeof variable.defaultValue === "string" ? variable.defaultValue : ""}
            required={variable.required}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={variable.name}
              checked={typeof fieldValue === "boolean" ? fieldValue : false}
              onCheckedChange={(checked) => updateFormData(variable.name, checked as boolean)}
            />
            <label htmlFor={variable.name} className="text-sm">
              {variable.label}
            </label>
          </div>
        );
      case "select":
        return (
          <Select
            value={typeof fieldValue === "string" ? fieldValue : (typeof variable.defaultValue === "string" ? variable.defaultValue : "")}
            onValueChange={(value) => updateFormData(variable.name, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variable.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const renderProjectTree = (items: ProjectStructureItem[], level = 0) => {
    return (
      <div className={`pl-${level * 4}`}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 py-1 text-sm">
            <span>{item.name}</span>
            {item.children && (
              <div className="ml-4">
                {renderProjectTree(item.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/templates">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Link>
          </Button>
          <div className="flex-1" />
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Step {currentStep} of 3
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Steps */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Step 1: Template Overview */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{template.name}</h1>
                      <p className="text-muted-foreground">by {template.author}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{template.description}</p>

                  <div>
                    <h3 className="font-semibold mb-3">Features Included</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {template.stack.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>{template.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span>{template.stars} stars</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-8 h-8 text-blue-500" />
                    <div>
                      <h1 className="text-2xl font-bold">Configure Your Project</h1>
                      <p className="text-muted-foreground">Customize the template settings</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {template.variables.map((variable) => (
                      <div key={variable.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            {variable.label}
                            {variable.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                        </div>
                        {renderFormField(variable)}
                        {variable.description && (
                          <p className="text-xs text-muted-foreground">{variable.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Project Structure Preview */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-8 h-8 text-green-500" />
                    <div>
                      <h1 className="text-2xl font-bold">Project Structure</h1>
                      <p className="text-muted-foreground">Preview what will be generated</p>
                    </div>
                  </div>

                  <Card className="p-4 bg-muted/30 font-mono text-sm">
                    {renderProjectTree(projectStructure)}
                  </Card>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Generation Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span>Project: {formData.project_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-500" />
                        <span>Platform: {formData.deployment_platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep === 3 ? (
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate Project
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Template Preview</h3>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-16 h-16 text-white" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline" className="capitalize">
                    {template.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stars</span>
                  <span>{template.stars}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <span>{template.author}</span>
                </div>
              </div>

              {template.isOfficial && (
                <Badge className="w-full mt-4 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-center">
                  ✨ Official Template
                </Badge>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
