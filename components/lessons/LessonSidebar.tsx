"use client"

import Link from "next/link"
import { CheckCircle2, Circle, Play, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { ModuleWithLessons } from "@/lib/xano/types"
import { motion } from "framer-motion"

interface LessonSidebarProps {
  courseSlug: string
  courseTitle: string | null
  modules: ModuleWithLessons[] | null
  currentLessonId: number
  completedLessonIds?: number[]
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonId,
  completedLessonIds = [],
}: LessonSidebarProps) {
  if (!modules || modules.length === 0) {
    return null
  }

  // Find which module contains the current lesson
  const currentModuleId = modules.find((m) => m.lessons?.some((l) => l.id === currentLessonId))?.id

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full lg:w-80 shrink-0"
    >
      <div className="sticky top-8 glass-card rounded-2xl overflow-hidden">
        {/* Course header */}
        <div className="p-5 border-b border-white/5">
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to course
          </Link>
          <h3 className="font-semibold text-foreground mt-3 line-clamp-2">{courseTitle ?? "Course"}</h3>
        </div>

        {/* Modules and lessons */}
        <div className="max-h-[60vh] overflow-y-auto">
          <Accordion type="multiple" defaultValue={currentModuleId ? [String(currentModuleId)] : []} className="w-full">
            {modules.map((module, moduleIndex) => {
              const lessonCount = module.lessons?.length ?? 0
              const completedCount = module.lessons?.filter((l) => completedLessonIds.includes(l.id)).length ?? 0

              return (
                <AccordionItem
                  key={module.id}
                  value={String(module.id)}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/5 text-left transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg glass text-muted-foreground text-xs font-bold shrink-0">
                        {moduleIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Module
                          </span>
                        </div>
                        <p className="font-medium text-sm text-foreground truncate mt-0.5">
                          {module.title ?? "Untitled Module"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {completedCount}/{lessonCount} lessons
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 pt-1">
                    <div className="ml-5 border-l-2 border-white/10 pl-4 space-y-1">
                      {module.lessons?.map((lesson) => {
                        const isActive = lesson.id === currentLessonId
                        const isCompleted = completedLessonIds.includes(lesson.id)

                        return (
                          <Link
                            key={lesson.id}
                            href={`/lessons/${lesson.slug}`}
                            className={cn(
                              "flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                              isActive
                                ? "bg-white/10 text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Play className="w-4 h-4 text-foreground shrink-0 fill-foreground" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title ?? "Untitled Lesson"}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </motion.div>
  )
}
