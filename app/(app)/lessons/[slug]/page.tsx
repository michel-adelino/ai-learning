import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { LessonPageContent } from "@/components/lessons";
import { getLessonBySlug } from "@/lib/xano/client";
import { getServerUser } from "@/lib/xano/server-auth";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const user = await getServerUser();

  let lesson;
  try {
    lesson = await getLessonBySlug(slug);
  } catch {
    notFound();
  }

  if (!lesson) {
    notFound();
  }

  // Transform lesson for existing components
  const transformedLesson = {
    _id: String(lesson.id),
    title: lesson.title,
    slug: { current: lesson.slug },
    description: lesson.description,
    video: lesson.mux_playback_id
      ? {
          asset: {
            playbackId: lesson.mux_playback_id,
            status: "ready",
            data: { duration: lesson.video_duration },
          },
        }
      : null,
    content: lesson.content ? JSON.parse(lesson.content) : null,
    completedBy: lesson.is_completed && user ? [String(user.id)] : [],
    courses: lesson.course
      ? [
          {
            _id: String(lesson.course.id),
            title: lesson.course.title,
            slug: { current: lesson.course.slug },
            tier: lesson.course.tier,
            modules: lesson.course.modules?.map((m) => ({
              _id: String(m.id),
              title: m.title,
              lessons: m.lessons?.map((l) => ({
                _id: String(l.id),
                title: l.title,
                slug: { current: l.slug },
                completedBy: l.is_completed && user ? [String(user.id)] : [],
              })) || [],
            })) || [],
          },
        ]
      : [],
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
      <main className="relative z-10 px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        <LessonPageContent lesson={transformedLesson} userId={user?.id ? String(user.id) : null} />
      </main>
    </div>
  );
}
