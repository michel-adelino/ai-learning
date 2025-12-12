import { notFound, redirect } from "next/navigation";
import { CourseContent } from "@/components/courses";
import { getCourseWithProgress, getCourseBySlug } from "@/lib/xano/client";
import { getAuthToken, getServerUser } from "@/lib/xano/server-auth";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const [authToken, user] = await Promise.all([
    getAuthToken(),
    getServerUser(),
  ]);

  let course;
  try {
    if (authToken) {
      course = await getCourseWithProgress(slug, authToken);
    } else {
      course = await getCourseBySlug(slug);
    }
  } catch {
    notFound();
  }

  if (!course) {
    notFound();
  }

  // Helper to check if value is an empty object
  const isEmptyObject = (obj: unknown): boolean => 
    obj !== null && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj as object).length === 0;
  
  // Helper to safely get string value (empty objects become null)
  const safeString = (val: unknown): string | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    if (isEmptyObject(val)) return null;
    return String(val);
  };

  // Helper to safely get any value (empty objects become null)
  const safeValue = <T,>(val: T): T | null => {
    if (val === null || val === undefined) return null;
    if (isEmptyObject(val)) return null;
    return val;
  };

  // Nest lessons inside their modules (Xano returns them separately)
  const modulesWithLessons = (course.modules || []).filter(m => m && !isEmptyObject(m)).map((m) => ({
    ...m,
    lessons: (course.lessons || []).filter((l) => l && !isEmptyObject(l) && l.module === m.id),
  }));

  // Transform the Xano course to match the existing component format
  const transformedCourse = {
    _id: String(course.id),
    title: safeString(course.title) || "Untitled Course",
    slug: { current: typeof course.slug === 'string' ? course.slug : slug },
    description: safeString(course.description),
    tier: (typeof course.tier === 'string' ? course.tier : "free") as "free" | "pro" | "ultra",
    featured: typeof course.featured === 'boolean' ? course.featured : false,
    thumbnail: course.image_url && typeof course.image_url === 'string'
      ? { asset: { _id: "", url: course.image_url } }
      : null,
    category: (() => {
      const cat = course.category as { id?: number; title?: string } | null;
      if (cat && typeof cat === 'object' && !isEmptyObject(cat) && cat.id) {
        return { _id: String(cat.id), title: safeString(cat.title) };
      }
      return null;
    })(),
    modules: modulesWithLessons.map((m) => ({
      _id: String(m.id),
      title: safeString(m.title) || "Untitled Module",
      description: safeString(m.description),
      completedBy: [] as string[],
      lessons: (m.lessons || []).map((l) => ({
        _id: String(l.id),
        title: safeString(l.title) || "Untitled Lesson",
        slug: { current: typeof l.slug === 'string' ? l.slug : "" },
        description: safeString(l.description),
        completedBy: l.is_completed ? [String(user?.id)] : [] as string[],
        video: l.mux_playback_id && typeof l.mux_playback_id === 'string'
          ? { asset: { playbackId: l.mux_playback_id } }
          : null,
      })),
    })),
    completedBy: [] as string[],
    moduleCount: modulesWithLessons.length,
    lessonCount: course.lessons?.length || 0,
    completedLessonCount: course.completed_lesson_count || 0,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zinc-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-zinc-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-zinc-400/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 pt-8 pb-12 max-w-7xl mx-auto">
        <CourseContent course={transformedCourse} userId={user?.id ? String(user.id) : null} />
      </main>
    </div>
  );
}
