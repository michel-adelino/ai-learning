"use client";

import Link from "next/link";
import { Play, CheckCircle2, Circle, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface TransformedLesson {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  description?: string | null;
  completedBy?: string[] | null;
  video?: { asset?: { playbackId?: string | null } | null } | null;
}

interface TransformedModule {
  _id: string;
  title?: string | null;
  description?: string | null;
  completedBy?: string[] | null;
  lessons?: TransformedLesson[] | null;
}

interface ModuleAccordionProps {
  modules: TransformedModule[] | null;
  userId?: string | null;
}

export function ModuleAccordion({ modules, userId }: ModuleAccordionProps) {
  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No modules available yet.</p>
      </div>
    );
  }

  const isLessonCompleted = (lesson: TransformedLesson): boolean => {
    return userId ? (lesson.completedBy?.includes(userId) ?? false) : false;
  };

  const getModuleProgress = (
    module: TransformedModule,
  ): { completed: number; total: number } => {
    const lessons = module.lessons ?? [];
    const total = lessons.length;
    const completed = lessons.filter((lesson) =>
      isLessonCompleted(lesson),
    ).length;
    return { completed, total };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <span className="text-sm text-zinc-500">{modules.length} modules</span>
      </div>

      <Accordion type="multiple" className="space-y-3" defaultValue={modules.length > 0 ? [modules[0]._id] : []}>
        {modules.map((module, index) => {
          const { completed, total } = getModuleProgress(module);
          const isModuleComplete = total > 0 && completed === total;
          const hasProgress = userId && completed > 0;

          return (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 data-[state=open]:bg-zinc-900/80 data-[state=open]:border-zinc-700"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isModuleComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-zinc-300'} text-sm font-bold shrink-0 transition-colors`}>
                    {isModuleComplete ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-semibold text-white">
                      {typeof module.title === 'string' ? module.title : "Untitled Module"}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {total} {total === 1 ? "lesson" : "lessons"}
                      {hasProgress && (
                        <span className="ml-2 text-emerald-400/80">
                          • {completed}/{total} completed
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Progress bar */}
                  {hasProgress && total > 0 && (
                    <div className="hidden sm:flex items-center gap-3 shrink-0 w-32">
                      <Progress
                        value={(completed / total) * 100}
                        className="flex-1 h-2 bg-zinc-700 [&>div]:bg-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4 pt-2">
                <div className="ml-5 border-l-2 border-zinc-700/50 pl-4 space-y-1">
                  {module.lessons?.map((lesson) => {
                    const lessonCompleted = isLessonCompleted(lesson);
                    const hasVideo = !!lesson.video?.asset?.playbackId;

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lessons/${lesson.slug?.current ?? lesson._id}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 transition-all group"
                      >
                        {lessonCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                        )}

                        <span
                          className={`flex-1 text-sm ${
                            lessonCompleted ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-300"
                          } group-hover:text-white transition-colors`}
                        >
                          {typeof lesson.title === 'string' ? lesson.title : "Untitled Lesson"}
                        </span>

                        {hasVideo && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-zinc-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-3 h-3" />
                            Video
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
