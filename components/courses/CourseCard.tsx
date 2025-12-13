"use client"

import Image from "next/image"
import Link from "next/link"
import { Lock, Play, Layers, CheckCircle2, Clock } from "lucide-react"
import { TIER_STYLES } from "@/lib/constants"
import type { Tier, User } from "@/lib/xano/types"
import { motion } from "framer-motion"

export interface CourseCardProps {
  title?: string | null
  description?: string | null
  tier?: Tier | null
  image_url?: string | null
  moduleCount?: number | null
  lessonCount?: number | null
  teacher?: Pick<User, "id" | "first_name" | "last_name"> | null
  slug?: string | { current: string } | null
  href?: string
  completedLessonCount?: number | null
  isCompleted?: boolean
  isLocked?: boolean
  showProgress?: boolean
  index?: number
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  tier,
  image_url,
  teacher,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  isLocked = false,
  showProgress = false,
  index = 0,
}: CourseCardProps) {
  const displayTier = tier ?? "free"
  const styles = TIER_STYLES[displayTier]
  const totalLessons = lessonCount ?? 0
  const completed = completedLessonCount ?? 0
  const progressPercent = totalLessons > 0 ? (completed / totalLessons) * 100 : 0

  // Handle slug as either string or object
  const slugValue = typeof slug === "string" ? slug : (slug?.current ?? "")
  const linkHref = href ?? `/courses/${slugValue}`
  const imageUrl = image_url ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={linkHref} className="group block h-full">
        <div className="relative h-full rounded-3xl glass-card overflow-hidden transition-all duration-500 hover:border-white/15 card-hover">
          {/* Subtle gradient border glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-white/5" />
          </div>

          {/* Course thumbnail/header */}
          <div
            className={`h-32 sm:h-40 md:h-48 bg-gradient-to-br ${styles.gradient} flex items-center justify-center relative overflow-hidden`}
          >
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={title ?? "Course thumbnail"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <motion.div
                className="text-6xl opacity-30"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                📚
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            {/* Tier badge or Completed badge */}
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30 backdrop-blur-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </motion.div>
            ) : (
              <div
                className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge} backdrop-blur-md shadow-lg glass-border`}
              >
                {displayTier}
              </div>
            )}

            {/* Locked overlay */}
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 glass-heavy flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/10"
                  >
                    <Lock className="w-7 h-7 text-muted-foreground" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground font-medium">Upgrade to unlock</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Course content */}
          <div className="p-4 sm:p-5 md:p-6 relative">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 text-foreground group-hover:text-gradient transition-all duration-300 line-clamp-2">
              {title ?? "Untitled Course"}
            </h3>

              {/* Teacher name */}
              {teacher && (
                <p className="text-sm text-muted-foreground mb-1">By {`${teacher.first_name ?? ""}${teacher.last_name ? ` ${teacher.last_name}` : ""}`.trim() || "Instructor"}</p>
              )}

              {description && (
              <p className="text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-2 leading-relaxed">{description}</p>
            )}

            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{moduleCount ?? 0}</span>
                <span className="text-muted-foreground">modules</span>
              </span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/5">
                <Play className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{lessonCount ?? 0}</span>
                <span className="text-muted-foreground">lessons</span>
              </span>
            </div>

            {/* Progress bar */}
            {showProgress && totalLessons > 0 && (
              <div className="mt-5 pt-5 border-t border-white/5">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {completed}/{totalLessons} completed
                  </span>
                  <span className="text-foreground font-semibold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="relative h-2.5 glass rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/60 to-white/80 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
