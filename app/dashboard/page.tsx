"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Play,
  Code,
  Globe,
  Download,
  Star,
  Users,
  GitBranch,
  TrendingUp,
  Activity,
  Settings,
  Zap,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const stats = {
  totalProjects: 12,
  totalDownloads: 2847,
  totalStars: 156,
  activeTeams: 3,
};

const recentProjects = [
  {
    id: "1",
    name: "E-commerce Dashboard",
    template: "Next.js SaaS Starter",
    status: "deployed",
    createdAt: "2024-01-15",
    downloads: 452,
    stars: 23,
    url: "https://my-store.vercel.app",
  },
  {
    id: "2",
    name: "Blog Platform",
    template: "Next.js Blog Template",
    status: "building",
    createdAt: "2024-01-12",
    downloads: 128,
    stars: 8,
    url: null,
  },
  {
    id: "3",
    name: "Mobile App Backend",
    template: "FastAPI Backend",
    status: "deployed",
    createdAt: "2024-01-10",
    downloads: 891,
    stars: 67,
    url: "https://api.myapp.railway.app",
  },
];

const popularTemplates = [
  {
    id: "1",
    name: "Next.js SaaS Starter",
    category: "fullstack",
    downloads: 15420,
    stars: 892,
    isOfficial: true,
  },
  {
    id: "2",
    name: "E-commerce Store",
    category: "fullstack",
    downloads: 21930,
    stars: 1250,
    isOfficial: true,
  },
  {
    id: "3",
    name: "Landing Page Template",
    category: "frontend",
    downloads: 18240,
    stars: 945,
    isOfficial: true,
  },
];

const teamMembers = [
  { id: "1", name: "John Doe", role: "owner", avatar: "👨‍💻" },
  { id: "2", name: "Jane Smith", role: "admin", avatar: "👩‍💻" },
  { id: "3", name: "Mike Johnson", role: "member", avatar: "🧑‍💻" },
];

const analyticsData = [
  { day: "Mon", projects: 4, downloads: 320 },
  { day: "Tue", projects: 7, downloads: 540 },
  { day: "Wed", projects: 3, downloads: 280 },
  { day: "Thu", projects: 9, downloads: 720 },
  { day: "Fri", projects: 6, downloads: 480 },
  { day: "Sat", projects: 2, downloads: 150 },
  { day: "Sun", projects: 1, downloads: 80 },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "building":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "member":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your projects, templates, and team collaborations
            </p>
          </div>
          <Button asChild>
            <Link href="/templates">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
            <div className="flex items-center justify-between mb-4">
              <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.totalDownloads.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Downloads</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.totalStars}</div>
            <div className="text-sm text-muted-foreground">Total Stars</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.activeTeams}</div>
            <div className="text-sm text-muted-foreground">Active Teams</div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {["overview", "projects", "templates", "team", "analytics"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Projects */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Projects</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/projects">View All</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.template}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Download className="w-3 h-3" />
                            <span>{project.downloads}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-3 h-3" />
                            <span>{project.stars}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Analytics Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
                <div className="space-y-4">
                  {analyticsData.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{data.day}</div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${(data.projects / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {data.projects}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${(data.downloads / 1000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {data.downloads}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Downloads</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/templates">
                      <Package className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Clone Repository
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </Card>

              {/* Team Members */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <Badge className={getRoleColor(member.role)} variant="outline">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Popular Templates */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Popular Templates</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/templates">View All</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {popularTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{template.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="w-3 h-3" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                        {template.isOfficial && (
                          <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            Official
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">All Projects</h3>
              <Button asChild>
                <Link href="/templates">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Projects Management</h3>
              <p className="text-muted-foreground mb-4">
                View and manage all your generated projects here.
              </p>
              <Button asChild>
                <Link href="/templates">
                  Create Your First Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "templates" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Your Templates</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Template Studio (Pro Feature)</h3>
              <p className="text-muted-foreground mb-4">
                Create and publish your own templates to share with the community.
              </p>
              <Button variant="outline">
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "team" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Team Management</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground mb-4">
                Invite team members and manage access to your projects.
              </p>
              <Button>
                Invite Team Members
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "analytics" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Analytics & Insights</h3>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed metrics about your projects and template usage.
              </p>
              <Button variant="outline">
                Upgrade to Analytics
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
