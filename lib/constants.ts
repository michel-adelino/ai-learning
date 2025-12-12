export const TIER_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ultra", label: "Ultra" },
] as const;

export type Tier = (typeof TIER_OPTIONS)[number]["value"];

type TierColor = "zinc" | "white" | "gray";

const TIER_COLOR_MAP: Record<TierColor, { border: string; text: string }> = {
  zinc: {
    border: "border-zinc-500/30",
    text: "text-zinc-400",
  },
  white: {
    border: "border-white/20",
    text: "text-white",
  },
  gray: {
    border: "border-zinc-600/30",
    text: "text-zinc-300",
  },
};

export function getTierColorClasses(color: TierColor) {
  return TIER_COLOR_MAP[color];
}

// Tier styling constants for UI components
export const TIER_STYLES: Record<
  Tier,
  {
    gradient: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  free: {
    gradient: "from-zinc-600 to-zinc-700",
    border: "border-zinc-600/30",
    text: "text-zinc-400",
    badge: "bg-zinc-600/90 text-white",
  },
  pro: {
    gradient: "from-zinc-400 to-zinc-500",
    border: "border-zinc-400/30",
    text: "text-zinc-300",
    badge: "bg-zinc-500/90 text-white",
  },
  ultra: {
    gradient: "from-white to-zinc-300",
    border: "border-white/30",
    text: "text-white",
    badge: "bg-white text-black",
  },
};

export const TIER_FEATURES = [
  {
    tier: "Free",
    color: "zinc",
    features: [
      "Access to foundational courses",
      "Community Discord access",
      "Basic projects & exercises",
      "Email support",
    ],
  },
  {
    tier: "Pro",
    color: "gray",
    features: [
      "Everything in Free",
      "All Pro-tier courses",
      "Advanced real-world projects",
      "Priority support",
      "Course completion certificates",
    ],
  },
  {
    tier: "Ultra",
    color: "white",
    features: [
      "Everything in Pro",
      "AI Learning Assistant",
      "Exclusive Ultra-only content",
      "Monthly 1-on-1 sessions",
      "Private Discord channel",
      "Early access to new courses",
      "Lifetime updates",
    ],
  },
] as const;
