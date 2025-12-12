"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/xano/auth-context";
import {
  getCourseBySlug,
  createModule,
  createLesson,
} from "@/lib/xano/client";
import { MuxUpload } from "@/components/teacher/MuxUpload";
import type { CourseWithModules, Module, Lesson } from "@/lib/xano/types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { authToken, user } = useAuth();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  // Module creation state
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  // Lesson creation state
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonPlaybackId, setLessonPlaybackId] = useState("");
  const [lessonDuration, setLessonDuration] = useState(0);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  const fetchCourse = useCallback(async () => {
    if (!authToken) return;
    
    try {
      // Note: We need to fetch by ID, but the client uses slug
      // For now, we'll use a workaround - fetch teacher's courses and find by ID
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_XANO_API_URL}/teacher/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      
      const data = await response.json();
      
      // Transform data: nest lessons inside their respective modules
      if (data.modules && data.lessons) {
        data.modules = data.modules.map((module: Module) => ({
          ...module,
          lessons: data.lessons.filter((lesson: Lesson) => lesson.module === module.id),
        }));
      }
      
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !course) return;

    setIsCreatingModule(true);
    try {
      // Calculate order_index based on existing modules
      const existingModulesCount = course.modules?.length || 0;
      
      await createModule(authToken, {
        course_id: course.id,
        title: moduleTitle,
        description: moduleDescription || undefined,
        order_index: existingModulesCount,
      });

      setModuleTitle("");
      setModuleDescription("");
      setShowModuleForm(false);
      fetchCourse(); // Refresh course data
    } catch (error) {
      console.error("Error creating module:", error);
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleLessonTitleChange = (value: string) => {
    setLessonTitle(value);
    setLessonSlug(generateSlug(value));
  };

  const handleCreateLesson = async (e: React.FormEvent, moduleId: number) => {
    e.preventDefault();
    if (!authToken || !course) return;

    setIsCreatingLesson(true);
    try {
      // Calculate order_index based on existing lessons in this module
      const module = course.modules?.find((m) => m.id === moduleId);
      const existingLessonsCount = module?.lessons?.length || 0;
      
      await createLesson(authToken, {
        module_id: moduleId,
        title: lessonTitle,
        slug: lessonSlug,
        description: lessonDescription || undefined,
        content: lessonContent || undefined,
        mux_playback_id: lessonPlaybackId || undefined,
        duration: lessonDuration || undefined,
        order_index: existingLessonsCount,
      });

      // Reset form
      setLessonTitle("");
      setLessonSlug("");
      setLessonDescription("");
      setLessonContent("");
      setLessonPlaybackId("");
      setLessonDuration(0);
      setShowLessonForm(null);
      fetchCourse(); // Refresh course data
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsCreatingLesson(false);
    }
  };

  const handleVideoUpload = (playbackId: string, duration: number) => {
    setLessonPlaybackId(playbackId);
    setLessonDuration(Math.round(duration));
  };

  // Check if user is teacher
  if (user && user.role !== "teacher") {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-zinc-400">Only teachers can access this page.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <Link href="/teacher">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/teacher"
          className="inline-flex items-center text-zinc-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Course Header */}
        <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-zinc-300">{course.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.tier === "free"
                      ? "bg-zinc-700 text-zinc-200"
                      : course.tier === "pro"
                      ? "bg-zinc-500/20 text-zinc-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {course.tier.toUpperCase()}
                </span>
                <span className="text-sm text-zinc-300">
                  {course.modules?.length || 0} modules •{" "}
                  {course.lessons?.length || 0} lessons
                </span>
              </div>
            </div>
            <Link href={`/courses/${course.slug}`} target="_blank">
              <Button variant="outline">Preview Course</Button>
            </Link>
          </div>
        </div>

        {/* Modules & Lessons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Course Content</h2>
            <Button
              onClick={() => setShowModuleForm(true)}
              className="bg-zinc-100 hover:bg-white text-zinc-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {/* Module Form */}
          {showModuleForm && (
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-medium mb-4">New Module</h3>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-200 font-medium">Module Title *</Label>
                  <Input
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="e.g., Getting Started"
                    required
                    className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-200 font-medium">Description</Label>
                  <Textarea
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    placeholder="What will students learn in this module?"
                    className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModuleForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-zinc-100 hover:bg-white text-zinc-900"
                    disabled={isCreatingModule || !moduleTitle}
                  >
                    {isCreatingModule ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Create Module"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Modules List */}
          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl overflow-hidden backdrop-blur-sm"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="w-5 h-5 text-zinc-300" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-zinc-300" />
                      )}
                      <span className="font-medium">{module.title}</span>
                      <span className="text-sm text-zinc-400">
                        ({module.lessons?.length || 0} lessons)
                      </span>
                    </div>
                  </button>

                  {/* Module Content */}
                  {expandedModules.has(module.id) && (
                    <div className="border-t border-zinc-700/50">
                      {/* Lessons */}
                      {module.lessons && module.lessons.length > 0 && (
                        <div className="divide-y divide-zinc-700/50">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between px-6 py-3"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.mux_playback_id ? (
                                  <Video className="w-4 h-4 text-zinc-400" />
                                ) : (
                                  <FileText className="w-4 h-4 text-zinc-400" />
                                )}
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-zinc-400">
                                {lesson.duration
                                  ? `${Math.floor(lesson.duration / 60)}:${String(
                                      lesson.duration % 60
                                    ).padStart(2, "0")}`
                                  : "No video"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Lesson Button */}
                      <div className="p-4 border-t border-zinc-700/50">
                        {showLessonForm === module.id ? (
                          <form
                            onSubmit={(e) => handleCreateLesson(e, module.id)}
                            className="space-y-4"
                          >
                            <h4 className="font-medium">New Lesson</h4>
                            
                            <div className="space-y-2">
                              <Label className="text-zinc-200 font-medium">Lesson Title *</Label>
                              <Input
                                value={lessonTitle}
                                onChange={(e) =>
                                  handleLessonTitleChange(e.target.value)
                                }
                                placeholder="e.g., Introduction to HTML"
                                required
                                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-zinc-200 font-medium">URL Slug *</Label>
                              <Input
                                value={lessonSlug}
                                onChange={(e) => setLessonSlug(e.target.value)}
                                placeholder="introduction-to-html"
                                required
                                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-zinc-200 font-medium">Description</Label>
                              <Textarea
                                value={lessonDescription}
                                onChange={(e) =>
                                  setLessonDescription(e.target.value)
                                }
                                placeholder="What will students learn?"
                                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-zinc-200 font-medium">Video Upload</Label>
                              <MuxUpload
                                onUploadComplete={handleVideoUpload}
                                onError={(err) => console.error(err)}
                              />
                              {lessonPlaybackId && (
                                <p className="text-sm text-green-400">
                                  ✓ Video uploaded (Duration:{" "}
                                  {Math.floor(lessonDuration / 60)}:
                                  {String(lessonDuration % 60).padStart(2, "0")})
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-zinc-200 font-medium">Lesson Content (HTML/Markdown)</Label>
                              <Textarea
                                value={lessonContent}
                                onChange={(e) => setLessonContent(e.target.value)}
                                placeholder="Write your lesson content here..."
                                rows={6}
                                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowLessonForm(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="bg-zinc-100 hover:bg-white text-zinc-900"
                                disabled={
                                  isCreatingLesson || !lessonTitle || !lessonSlug
                                }
                              >
                                {isCreatingLesson ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Create Lesson"
                                )}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => setShowLessonForm(module.id)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-12 text-center backdrop-blur-sm">
              <FileText className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No modules yet
              </h3>
              <p className="text-zinc-400 mb-4">
                Add modules to organize your course content
              </p>
              <Button
                onClick={() => setShowModuleForm(true)}
                className="bg-zinc-100 hover:bg-white text-zinc-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Module
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
