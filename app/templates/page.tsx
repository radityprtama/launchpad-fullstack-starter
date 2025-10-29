"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Star,
  Download,
  Package,
  Play,
  Code,
  Globe,
  Database,
  Shield,
  Sparkles,
  Filter,
  Grid,
  List,
} from "lucide-react";
import Link from "next/link";

// Mock template data
const templates = [
  {
    id: "1",
    name: "Next.js SaaS Starter",
    description: "Production-ready SaaS boilerplate with authentication, billing, and dashboard",
    category: "fullstack",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    image: "/api/placeholder/300/200",
    downloads: 15420,
    stars: 892,
    isOfficial: true,
    isPublic: true,
    author: "LaunchPad Team",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "React Native App",
    description: "Cross-platform mobile app template with navigation and state management",
    category: "mobile",
    stack: ["React Native", "TypeScript", "Redux Toolkit"],
    image: "/api/placeholder/300/200",
    downloads: 8930,
    stars: 456,
    isOfficial: false,
    isPublic: true,
    author: "Community",
    updatedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "FastAPI Backend",
    description: "RESTful API template with authentication, database, and documentation",
    category: "backend",
    stack: ["FastAPI", "Python", "PostgreSQL", "Docker"],
    image: "/api/placeholder/300/200",
    downloads: 12670,
    stars: 723,
    isOfficial: false,
    isPublic: true,
    author: "DevOps Pro",
    updatedAt: "2024-01-12",
  },
  {
    id: "4",
    name: "E-commerce Store",
    description: "Complete online store with products, cart, payments, and admin panel",
    category: "fullstack",
    stack: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
    image: "/api/placeholder/300/200",
    downloads: 21930,
    stars: 1250,
    isOfficial: true,
    isPublic: true,
    author: "LaunchPad Team",
    updatedAt: "2024-01-08",
  },
  {
    id: "5",
    name: "CLI Tool Boilerplate",
    description: "Command-line interface template with argument parsing and configuration",
    category: "cli",
    stack: ["Node.js", "TypeScript", "Commander.js"],
    image: "/api/placeholder/300/200",
    downloads: 5670,
    stars: 289,
    isOfficial: false,
    isPublic: true,
    author: "CLI Expert",
    updatedAt: "2024-01-05",
  },
  {
    id: "6",
    name: "Landing Page Template",
    description: "High-converting landing page with sections, forms, and analytics",
    category: "frontend",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/api/placeholder/300/200",
    downloads: 18240,
    stars: 945,
    isOfficial: true,
    isPublic: true,
    author: "LaunchPad Team",
    updatedAt: "2024-01-14",
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "cli", label: "CLI" },
  { value: "other", label: "Other" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Recently Updated" },
  { value: "downloads", label: "Most Downloaded" },
  { value: "stars", label: "Most Starred" },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads;
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "downloads":
        return b.downloads - a.downloads;
      case "stars":
        return b.stars - a.stars;
      default:
        return 0;
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
      case "mobile":
      case "desktop":
        return <Globe className="w-4 h-4" />;
      case "backend":
        return <Database className="w-4 h-4" />;
      case "fullstack":
        return <Shield className="w-4 h-4" />;
      case "cli":
        return <Code className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "backend":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "fullstack":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "mobile":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "cli":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Template Marketplace
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and customize production-ready boilerplates to accelerate your development workflow.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            <span>{templates.length} Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-green-500" />
            <span>{templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()} Downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{templates.reduce((sum, t) => sum + t.stars, 0).toLocaleString()} Stars</span>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
              {viewMode === "grid" ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">by {template.author}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {template.isOfficial && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Official
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.stack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {template.stack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.stack.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{template.stars}</span>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(template.category)}
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/templates/${template.id}/generate`}>
                        <Play className="w-4 h-4 mr-2" />
                        Use Template
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/templates/${template.id}`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">by {template.author}</p>
                      </div>
                      <div className="flex gap-1">
                        {template.isOfficial && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Official
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(template.category)}>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(template.category)}
                            <span className="capitalize">{template.category}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{template.stars}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.stack.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={`/templates/${template.id}/generate`}>
                        <Play className="w-4 h-4 mr-2" />
                        Use Template
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/templates/${template.id}`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
