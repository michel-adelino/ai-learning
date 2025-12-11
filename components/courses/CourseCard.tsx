"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Layers, CheckCircle2, Clock } from "lucide-react";
import { TIER_STYLES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import type { Tier } from "@/lib/xano/types";

export interface CourseCardProps {
  title?: string | null;
  description?: string | null;
  tier?: Tier | null;
  image_url?: string | null;
  moduleCount?: number | null;
  lessonCount?: number | null;
  slug?: string | { current: string } | null;
  href?: string;
  completedLessonCount?: number | null;
  isCompleted?: boolean;
  isLocked?: boolean;
  showProgress?: boolean;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  tier,
  image_url,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  isLocked = false,
  showProgress = false,
}: CourseCardProps) {
  const displayTier = tier ?? "free";
  const styles = TIER_STYLES[displayTier];
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent =
    totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  // Handle slug as either string or object
  const slugValue = typeof slug === "string" ? slug : slug?.current ?? "";
  const linkHref = href ?? `/courses/${slugValue}`;
  const imageUrl = image_url ?? null;

  return (
    <Link href={linkHref} className="group block">
      <div className="relative rounded-2xl glass border border-white/5 overflow-hidden card-hover">
        {/* Gradient glow on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/0 via-transparent to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500 pointer-events-none" />
        
        {/* Course thumbnail/header */}
        <div
          className={`h-40 bg-linear-to-br ${styles.gradient} flex items-center justify-center relative overflow-hidden`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-300">📚</div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

          {/* Tier badge or Completed badge */}
          {isCompleted ? (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30 backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </div>
          ) : (
            <div
              className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge} backdrop-blur-sm shadow-lg`}
            >
              {displayTier}
            </div>
          )}

          {/* Locked overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-white/10">
                  <Lock className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="text-sm text-zinc-300 font-medium">
                  Upgrade to unlock
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Course content */}
        <div className="p-5 relative">
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-gradient transition-all duration-300 line-clamp-2">
            {title ?? "Untitled Course"}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-zinc-300">{moduleCount ?? 0}</span> modules
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50">
              <Play className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-zinc-300">{lessonCount ?? 0}</span> lessons
            </span>
          </div>

          {/* Progress bar */}
          {showProgress && totalLessons > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-sm mb-2.5">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {completed}/{totalLessons} completed
                </span>
                <span className="text-violet-400 font-medium">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2.5 bg-zinc-800/70 rounded-full overflow-hidden [&>div]:bg-linear-to-r [&>div]:from-violet-500 [&>div]:to-fuchsia-500 [&>div]:rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
