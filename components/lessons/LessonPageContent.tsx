"use client"

import Link from "next/link"
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GatedFallback } from "@/components/courses/GatedFallback"
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier-xano"
import { MuxVideoPlayerXano } from "./MuxVideoPlayerXano"
import { LessonContentXano } from "./LessonContentXano"
import { LessonCompleteButton } from "./LessonCompleteButton"
import { LessonSidebar } from "./LessonSidebar"
import type { LessonWithContext } from "@/lib/xano/types"
import { motion } from "framer-motion"

interface LessonPageContentProps {
  lesson: LessonWithContext
  userId: number | null
  completedLessonIds: number[]
}

export function LessonPageContent({ lesson, userId, completedLessonIds }: LessonPageContentProps) {
  const userTier = useUserTier()

  // Check if user has access to this lesson's course
  const course = lesson.course
  const hasAccess = course ? hasTierAccess(userTier, course.tier) : false

  // Check if user has completed this lesson
  const isCompleted = completedLessonIds.includes(lesson.id)

  // Find previous and next lessons for navigation
  const modules = course?.modules ?? []
  let prevLesson: { id: number; slug: string; title: string } | null = null
  let nextLesson: { id: number; slug: string; title: string } | null = null

  if (modules.length > 0) {
    const allLessons: Array<{ id: number; slug: string; title: string }> = []

    for (const module of modules) {
      if (module.lessons) {
        for (const l of module.lessons) {
          allLessons.push({
            id: l.id,
            slug: l.slug,
            title: l.title ?? "Untitled Lesson",
          })
        }
      }
    }

    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      {course && hasAccess && (
        <LessonSidebar
          courseSlug={course.slug}
          courseTitle={course.title}
          modules={course.modules ?? null}
          currentLessonId={lesson.id}
          completedLessonIds={completedLessonIds}
        />
      )}

      {/* Main content area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 min-w-0"
      >
        {hasAccess ? (
          <>
            {/* Video Player */}
            {lesson.mux_playback_id && (
              <MuxVideoPlayerXano
                playbackId={lesson.mux_playback_id}
                title={lesson.title ?? undefined}
                className="mb-8"
              />
            )}

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gradient">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && <p className="text-muted-foreground">{lesson.description}</p>}
              </div>

              {userId && (
                <LessonCompleteButton lessonId={lesson.id} lessonSlug={lesson.slug} isCompleted={isCompleted} />
              )}
            </div>

            {/* Lesson Content */}
            {lesson.content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="glass-card rounded-2xl p-6 md:p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold">Lesson Notes</h2>
                </div>
                <LessonContentXano content={lesson.content} />
              </motion.div>
            )}

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`}>
                  <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                    <span className="hidden sm:inline">{nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <GatedFallback requiredTier={course?.tier} />
        )}
      </motion.div>
    </div>
  )
}
