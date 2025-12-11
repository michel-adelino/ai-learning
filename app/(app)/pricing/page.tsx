"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  Code2,
  Rocket,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/xano/auth-context";
import { TIER_FEATURES, getTierColorClasses } from "@/lib/constants";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tier: "free" as const,
    icon: Code2,
    description: "Perfect for getting started",
    color: "zinc",
    features: [
      "Access to free courses",
      "Community support",
      "Progress tracking",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    tier: "pro" as const,
    icon: Rocket,
    description: "For serious learners",
    color: "violet",
    popular: true,
    features: [
      "Everything in Free",
      "Access to Pro courses",
      "Priority support",
      "Downloadable resources",
    ],
  },
  {
    name: "Ultra",
    price: "$49",
    period: "/month",
    tier: "ultra" as const,
    icon: Crown,
    description: "The complete experience",
    color: "amber",
    features: [
      "Everything in Pro",
      "AI Tutor access",
      "Ultra exclusive content",
      "1-on-1 mentorship",
      "Early access to new courses",
    ],
  },
];

export default function PricingPage() {
  const { user, isAuthenticated, upgradeTier, isLoading: authLoading } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tier: "pro" | "ultra") => {
    if (!isAuthenticated) {
      // Redirect to login/signup
      window.location.href = "/auth/signup";
      return;
    }

    setUpgrading(tier);
    try {
      await upgradeTier(tier);
      // In production, this would redirect to a payment page
      alert(`Upgraded to ${tier}! In production, this would process payment.`);
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to upgrade. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  const currentTier = user?.tier || "free";

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">
              Simple, transparent pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Choose your{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              learning path
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. Unlock Pro for advanced
            content or go Ultra for AI-powered learning, exclusive
            masterclasses, and 1-on-1 access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentTier === plan.tier;
            const canUpgrade =
              plan.tier !== "free" &&
              (currentTier === "free" ||
                (currentTier === "pro" && plan.tier === "ultra"));

            const borderColor =
              plan.color === "violet"
                ? "border-violet-500/30 hover:border-violet-500/50"
                : plan.color === "amber"
                  ? "border-amber-500/30 hover:border-amber-500/50"
                  : "border-zinc-800 hover:border-zinc-700";

            const bgGradient =
              plan.color === "violet"
                ? "from-violet-500/10"
                : plan.color === "amber"
                  ? "from-amber-500/10"
                  : "from-zinc-800/50";

            const iconBg =
              plan.color === "violet"
                ? "bg-violet-600"
                : plan.color === "amber"
                  ? "bg-amber-500"
                  : "bg-zinc-800";

            const checkColor =
              plan.color === "violet"
                ? "text-violet-400"
                : plan.color === "amber"
                  ? "text-amber-400"
                  : "text-green-500";

            return (
              <div
                key={plan.tier}
                className={`relative p-7 rounded-3xl glass border ${borderColor} transition-all duration-300 card-hover ${plan.popular ? 'ring-2 ring-violet-500/50 shadow-xl shadow-violet-500/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 text-xs font-bold shadow-lg shadow-violet-500/30">
                    ⚡ Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5 shadow-lg ${plan.color === 'violet' ? 'shadow-violet-500/30' : plan.color === 'amber' ? 'shadow-amber-500/30' : 'shadow-zinc-700/30'}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-5">{plan.description}</p>

                <div className="mb-7 pb-7 border-b border-white/5">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-zinc-400 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-zinc-300"
                    >
                      <CheckCircle2 className={`w-5 h-5 mt-0 shrink-0 ${checkColor}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button className="w-full rounded-xl py-5 glass border border-white/10" variant="outline" disabled>
                    ✓ Current Plan
                  </Button>
                ) : canUpgrade ? (
                  <Button
                    className={`w-full rounded-xl py-5 font-semibold transition-all duration-300 ${
                      plan.color === "violet"
                        ? "bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                        : plan.color === "amber"
                          ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                          : ""
                    }`}
                    onClick={() => handleUpgrade(plan.tier as "pro" | "ultra")}
                    disabled={upgrading === plan.tier}
                  >
                    {upgrading === plan.tier ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                ) : plan.tier === "free" ? (
                  <Button className="w-full rounded-xl py-5 glass border border-white/10 hover:border-white/20" variant="outline" asChild>
                    <Link href="/auth/signup">Get Started Free</Link>
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
              },
              {
                q: "Can I switch between plans?",
                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl glass border border-white/5 hover:border-white/10 transition-colors"
              >
                <h3 className="font-semibold mb-2 text-white">{faq.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
