import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
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

  // Transform the Xano course to match the existing component format
  const transformedCourse = {
    _id: String(course.id),
    title: course.title,
    slug: { current: course.slug },
    description: course.description,
    tier: course.tier,
    featured: course.featured,
    thumbnail: course.thumbnail_url
      ? { asset: { _id: "", url: course.thumbnail_url } }
      : null,
    category: course.category
      ? { _id: String(course.category.id), title: course.category.title }
      : null,
    modules: course.modules?.map((m) => ({
      _id: String(m.id),
      title: m.title,
      description: m.description,
      completedBy: [],
      lessons: m.lessons?.map((l) => ({
        _id: String(l.id),
        title: l.title,
        slug: { current: l.slug },
        description: l.description,
        completedBy: l.is_completed ? [String(user?.id)] : [],
        video: l.mux_playback_id
          ? { asset: { playbackId: l.mux_playback_id } }
          : null,
      })) || [],
    })) || [],
    completedBy: [],
    moduleCount: course.module_count || course.modules?.length || 0,
    lessonCount: course.lesson_count || 0,
    completedLessonCount: course.completed_lesson_count || 0,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
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

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <CourseContent course={transformedCourse} userId={user?.id ? String(user.id) : null} />
      </main>
    </div>
  );
}
