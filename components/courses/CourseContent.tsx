"use client";

import { useAuth } from "@/lib/xano/auth-context";
import { CourseHero } from "./CourseHero";
import { ModuleAccordion } from "./ModuleAccordion";
import { CourseCompleteButton } from "./CourseCompleteButton";
import { GatedFallback } from "./GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier-xano";
import { Skeleton } from "../ui/skeleton";

interface CourseContentProps {
  course: {
    _id: string;
    title?: string | null;
    description?: string | null;
    tier?: "free" | "pro" | "ultra" | null;
    thumbnail?: { asset?: { _id?: string; url?: string } | null } | null;
    category?: { _id?: string; title?: string | null } | null;
    moduleCount?: number | null;
    lessonCount?: number | null;
    slug?: { current?: string | null } | null;
    modules?: Array<{
      _id: string;
      title?: string | null;
      description?: string | null;
      completedBy?: string[] | null;
      lessons?: Array<{
        _id: string;
        title?: string | null;
        slug?: { current?: string | null } | null;
        description?: string | null;
        completedBy?: string[] | null;
        video?: { asset?: { playbackId?: string | null } | null } | null;
      }> | null;
    }> | null;
    completedBy?: string[] | null;
  };
  userId: string | null;
}

export function CourseContent({ course, userId }: CourseContentProps) {
  const { isLoading: isAuthLoading } = useAuth();
  const userTier = useUserTier();

  // Check if user has access to this course
  const hasAccess = hasTierAccess(userTier, course.tier ?? null);

  // Calculate completion stats from actual lesson data
  let totalLessons = 0;
  let completedLessons = 0;

  for (const m of course.modules ?? []) {
    for (const l of m.lessons ?? []) {
      totalLessons++;
      if (userId && l.completedBy?.includes(userId)) {
        completedLessons++;
      }
    }
  }

  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

  if (isAuthLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description ?? null}
        tier={course.tier}
        thumbnail={course.thumbnail}
        category={course.category}
        moduleCount={course.moduleCount}
        lessonCount={course.lessonCount}
      />

      {hasAccess ? (
        <div className="space-y-8">
          {/* Course completion progress */}
          {userId && (
            <CourseCompleteButton
              courseId={Number(course._id)}
              courseSlug={course.slug!.current!}
              isCompleted={isCourseCompleted}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
            />
          )}

          <ModuleAccordion modules={course.modules ?? null} userId={userId} />
        </div>
      ) : (
        <GatedFallback requiredTier={course.tier} />
      )}
    </>
  );
}
