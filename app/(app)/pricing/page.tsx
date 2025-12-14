"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  Rocket,
  Crown,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/xano/auth-context";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tier: "free" as const,
    icon: GraduationCap,
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
    color: "emerald",
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
  const {
    user,
    isAuthenticated,
    upgradeTier,
    isLoading: authLoading,
  } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tier: "pro" | "ultra") => {
    if (!isAuthenticated) {
      window.location.href = "/auth/signup";
      return;
    }

    setUpgrading(tier);
    try {
      await upgradeTier(tier);
      alert(`Upgraded to ${tier}! In production, this would process payment.`);
    } catch (error) {
      alert("Failed to upgrade. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  const currentTier = user?.tier || "free";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-amber-400/[0.02] rounded-full blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Header />

      <main className="relative z-10 px-6 lg:px-12 pt-28 pb-14 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">
              Simple, transparent pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Choose your <span className="text-gradient">learning path</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you are ready. Unlock Pro for advanced
            content or go Ultra for AI-powered learning and 1-on-1 access.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentTier === plan.tier;
            const tierRank = { free: 0, pro: 1, ultra: 2 };
            const currentRank =
              tierRank[currentTier as keyof typeof tierRank] || 0;
            const planRank = tierRank[plan.tier as keyof typeof tierRank];
            const canUpgrade = isAuthenticated && planRank > currentRank;
            const isLowerTier = planRank < currentRank;

            return (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-7 rounded-3xl glass-card card-hover ${
                  plan.popular
                    ? "border border-emerald-500/30 glow-emerald animate-border-glow"
                    : ""
                } ${
                  plan.color === "amber"
                    ? "border border-amber-500/20 glow-gold"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-emerald-500 text-background text-xs font-bold shadow-lg">
                    Popular
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                    plan.color === "emerald"
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                      : plan.color === "amber"
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                      : "glass"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      plan.color === "zinc"
                        ? "text-muted-foreground"
                        : "text-background"
                    }`}
                  />
                </div>

                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-7 pb-7 border-b border-white/5">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 mt-0 shrink-0 ${
                          plan.color === "emerald"
                            ? "text-emerald-400"
                            : plan.color === "amber"
                            ? "text-amber-400"
                            : "text-white/30"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button
                    className="w-full rounded-xl py-5 glass border border-white/20 text-foreground cursor-default bg-transparent"
                    variant="outline"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : canUpgrade ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full rounded-xl py-5 font-semibold transition-all duration-300 btn-shiny ${
                        plan.color === "emerald"
                          ? "bg-emerald-500 text-background hover:bg-emerald-400 glow-emerald"
                          : plan.color === "amber"
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-background hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25"
                          : "glass hover:bg-white/10 bg-transparent"
                      }`}
                      onClick={() =>
                        handleUpgrade(plan.tier as "pro" | "ultra")
                      }
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
                  </motion.div>
                ) : isLowerTier ? (
                  <Button
                    className="w-full rounded-xl py-5 glass border border-white/10 text-muted-foreground cursor-not-allowed bg-transparent"
                    variant="outline"
                    disabled
                  >
                    Included in your plan
                  </Button>
                ) : plan.tier === "free" && !isAuthenticated ? (
                  <Button
                    className="w-full rounded-xl py-5 btn-shiny glass border-white/20 hover:border-white/40 hover:bg-white/5 bg-transparent text-foreground"
                    variant="outline"
                    asChild
                  >
                    <Link href="/auth/signup">Get Started Free</Link>
                  </Button>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gradient">
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
                a: "You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="p-5 rounded-2xl glass-card hover:border-white/10 transition-colors"
              >
                <h3 className="font-semibold mb-2 text-foreground">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
