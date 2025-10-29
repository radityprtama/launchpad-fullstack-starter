"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Star,
  Zap,
  Users,
  Crown,
  Building,
  Rocket,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  Package,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "FREE",
    price: "$0",
    period: "forever",
    description: "Perfect for individual developers exploring the platform",
    icon: Star,
    color: "from-gray-600 to-gray-700",
    features: [
      { name: "Access to free templates", included: true },
      { name: "Generate up to 5 projects/month", included: true },
      { name: "Community support", included: true },
      { name: "Basic analytics", included: true },
      { name: "Single user account", included: true },
      { name: "Public repositories only", included: true },
      { name: "Premium templates", included: false },
      { name: "Team collaboration", included: false },
      { name: "Private repositories", included: false },
      { name: "Priority support", included: false },
      { name: "Custom templates", included: false },
      { name: "API access", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "PRO",
    price: "$29",
    period: "per month",
    description: "Ideal for professional developers and small teams",
    icon: Zap,
    color: "from-blue-600 to-purple-600",
    features: [
      { name: "Access to all templates", included: true },
      { name: "Unlimited project generation", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Individual user account", included: true },
      { name: "Private repositories", included: true },
      { name: "Premium templates", included: true },
      { name: "Template customization", included: true },
      { name: "Deployment automation", included: true },
      { name: "API access (1000 requests/month)", included: true },
      { name: "Team collaboration (up to 3 members)", included: false },
      { name: "Custom domain", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "team",
    name: "TEAM",
    price: "$99",
    period: "per month",
    description: "Built for growing teams and agencies",
    icon: Users,
    color: "from-green-600 to-emerald-600",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Up to 10 team members", included: true },
      { name: "Role-based access control", included: true },
      { name: "Team dashboard", included: true },
      { name: "Priority email support", included: true },
      { name: "Shared templates library", included: true },
      { name: "Team analytics", included: true },
      { name: "Custom domain", included: true },
      { name: "API access (5000 requests/month)", included: true },
      { name: "Template branding", included: true },
      { name: "Advanced deployment options", included: true },
      { name: "White-label options", included: false },
    ],
    cta: "Start Team Trial",
    popular: false,
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for large organizations",
    icon: Building,
    color: "from-purple-600 to-pink-600",
    features: [
      { name: "Everything in Team", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Advanced security features", included: true },
      { name: "SSO & SAML integration", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
      { name: "On-premise deployment option", included: true },
      { name: "Custom integrations", included: true },
      { name: "SLA guarantee", included: true },
      { name: "Custom contracts", included: true },
      { name: "Training & onboarding", included: true },
      { name: "White-label platform", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    company: "Tech Startup",
    content: "LaunchPad has revolutionized our development process. We can ship new projects 10x faster!",
    avatar: "👩‍💻",
    plan: "Pro",
  },
  {
    name: "Michael Rodriguez",
    role: "CTO",
    company: "Digital Agency",
    content: "The Team plan has transformed how our agency works. Collaboration has never been easier.",
    avatar: "👨‍💼",
    plan: "Team",
  },
  {
    name: "Emily Watson",
    role: "Solo Developer",
    company: "Freelance",
    content: "As a freelancer, the Pro plan gives me everything I need to compete with larger agencies.",
    avatar: "👩‍💻",
    plan: "Pro",
  },
];

const faqs = [
  {
    question: "Can I switch between plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for Enterprise customers, we also offer wire transfers and invoice-based billing.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes! We offer a 14-day free trial for all paid plans (Pro and Team). No credit card required to start your trial.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription at any time. Your access will continue until the end of the current billing period.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "We'll notify you when you're approaching your limits. You can upgrade your plan at any time. For Enterprise plans, limits are customizable.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Save 20% with annual billing on Pro and Team plans. Enterprise plans have custom pricing based on your needs.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getPlanPrice = (plan: typeof plans[0]) => {
    if (plan.price === "Custom") return plan.price;
    if (plan.price === "$0") return plan.price;

    const basePrice = parseInt(plan.price.replace("$", ""));
    const yearlyPrice = billingPeriod === "yearly" ? Math.floor(basePrice * 0.8) : basePrice;
    return `$${yearlyPrice}`;
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.price === "Custom") return plan.period;
    if (plan.price === "$0") return plan.period;
    return billingPeriod === "yearly" ? "per year" : plan.period;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            💰 Pricing Plans
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your LaunchPad Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Select the perfect plan for your needs. All plans include our core features with different levels of access and support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingPeriod === "monthly" ? "font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 ${billingPeriod === "yearly" ? "left-0" : "right-0"} transition-all duration-300`} />
              <span className="relative z-10 text-white">
                {billingPeriod === "yearly" ? "Yearly" : "Monthly"}
              </span>
            </Button>
            <span className={`text-sm ${billingPeriod === "yearly" ? "font-medium" : "text-muted-foreground"}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden ${plan.popular ? "ring-2 ring-blue-500 shadow-xl" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-xs font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-6 bg-gradient-to-br ${plan.color} text-white`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <plan.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm opacity-90">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold">
                    {getPlanPrice(plan)}
                    <span className="text-lg font-normal opacity-90 ml-1">
                      {plan.price !== "Custom" && `/${getPeriod(plan).split(" ")[1]}`}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">{getPeriod(plan)}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                  asChild
                >
                  {plan.id === "enterprise" ? (
                    <Link href="/contact-sales">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <Link href={`/sign-up?plan=${plan.id}`}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about LaunchPad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <Badge variant="outline" className="mt-4">
                  {testimonial.plan} Plan
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We&apos;ve got answers
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold">{faq.question}</h3>
                    <div className={`transform transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Join thousands of developers who are already building amazing projects with LaunchPad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/templates">
                Browse Templates
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
