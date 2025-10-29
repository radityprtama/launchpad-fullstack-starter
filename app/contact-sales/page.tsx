"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  Crown,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Send,
  ArrowLeft,
  Star,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const contactReasons = [
  {
    id: "sales",
    title: "Sales Inquiry",
    description: "Interested in Enterprise pricing or custom solutions",
    icon: Building,
    color: "from-blue-600 to-purple-600",
  },
  {
    id: "support",
    title: "Technical Support",
    description: "Need help with platform features or troubleshooting",
    icon: Users,
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "partnership",
    title: "Partnership",
    description: "Interested in partnership opportunities",
    icon: Crown,
    color: "from-orange-600 to-red-600",
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Share your thoughts and suggestions",
    icon: MessageSquare,
    color: "from-purple-600 to-pink-600",
  },
];

const benefits = [
  "Dedicated account manager",
  "Custom SLA guarantees",
  "Priority 24/7 support",
  "Custom integrations",
  "On-premise deployment",
  "Advanced security features",
  "White-label options",
  "Training & onboarding",
];

export default function ContactSalesPage() {
  const [selectedReason, setSelectedReason] = useState("sales");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    message: "",
    teamSize: "",
    currentStack: "",
    specificNeeds: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert("Thank you for your inquiry! Our team will get back to you within 24 hours.");
    setIsSubmitting(false);

    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      role: "",
      phone: "",
      message: "",
      teamSize: "",
      currentStack: "",
      specificNeeds: "",
    });
  };

  const selectedReasonData = contactReasons.find(reason => reason.id === selectedReason) || contactReasons[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            🏢 Enterprise Solutions
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Sales
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let&apos;s discuss how LaunchPad can accelerate your development workflow at scale
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Reasons */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">How can we help you?</h3>
              <div className="space-y-3">
                {contactReasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedReason === reason.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-muted-foreground/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${reason.color} flex items-center justify-center flex-shrink-0`}>
                        <reason.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{reason.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{reason.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Other ways to reach us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">enterprise@launchpad.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Live Chat</p>
                    <p className="text-xs text-muted-foreground">Available 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedReasonData?.color} flex items-center justify-center`}>
                  {selectedReasonData?.icon && <selectedReasonData.icon className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedReasonData?.title}</h2>
                  <p className="text-muted-foreground">Fill out the form below and we&apos;ll get back to you</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Work Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      placeholder="CTO, Engineering Manager, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Size</label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange("teamSize", e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 developers</option>
                      <option value="11-50">11-50 developers</option>
                      <option value="51-200">51-200 developers</option>
                      <option value="201-1000">201-1000 developers</option>
                      <option value="1000+">1000+ developers</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Tech Stack</label>
                  <Input
                    value={formData.currentStack}
                    onChange={(e) => handleInputChange("currentStack", e.target.value)}
                    placeholder="React, Node.js, PostgreSQL, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specific Needs *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your specific requirements, current challenges, and what you&apos;re looking to achieve..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Enterprise Benefits */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200/50 dark:border-purple-700/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Enterprise Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock the full potential of LaunchPad with enterprise-grade features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.9/5 customer satisfaction rating
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Rocket className="w-4 h-4 mr-2" />
                Schedule Demo
              </Button>
              <Button size="lg" variant="outline">
                Download Whitepaper
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
