"use client";

import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier-xano";
import { MuxVideoPlayerXano } from "./MuxVideoPlayerXano";
import { LessonContentXano } from "./LessonContentXano";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonSidebar } from "./LessonSidebar";
import type { LessonWithContext } from "@/lib/xano/types";

interface LessonPageContentProps {
  lesson: LessonWithContext;
  userId: number | null;
  completedLessonIds: number[];
}

export function LessonPageContent({ lesson, userId, completedLessonIds }: LessonPageContentProps) {
  const userTier = useUserTier();

  // Check if user has access to this lesson's course
  const course = lesson.course;
  const hasAccess = course ? hasTierAccess(userTier, course.tier) : false;

  // Check if user has completed this lesson
  const isCompleted = completedLessonIds.includes(lesson.id);

  // Find previous and next lessons for navigation
  const modules = course?.modules ?? [];
  let prevLesson: { id: number; slug: string; title: string } | null = null;
  let nextLesson: { id: number; slug: string; title: string } | null = null;

  if (modules.length > 0) {
    const allLessons: Array<{ id: number; slug: string; title: string }> = [];

    for (const module of modules) {
      if (module.lessons) {
        for (const l of module.lessons) {
          allLessons.push({
            id: l.id,
            slug: l.slug,
            title: l.title ?? "Untitled Lesson",
          });
        }
      }
    }

    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;
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
      <div className="flex-1 min-w-0">
        {hasAccess ? (
          <>
            {/* Video Player */}
            {lesson.mux_playback_id && (
              <MuxVideoPlayerXano
                playbackId={lesson.mux_playback_id}
                title={lesson.title ?? undefined}
                className="mb-6"
              />
            )}

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && (
                  <p className="text-zinc-400">{lesson.description}</p>
                )}
              </div>

              {userId && (
                <LessonCompleteButton
                  lessonId={lesson.id}
                  lessonSlug={lesson.slug}
                  isCompleted={isCompleted}
                />
              )}
            </div>

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Lesson Notes</h2>
                </div>
                <LessonContentXano content={lesson.content} />
              </div>
            )}

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
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
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white">
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
      </div>
    </div>
  );
}
