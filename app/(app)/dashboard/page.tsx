import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight, Trophy, Target, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { CourseList } from "@/components/courses";
import { getAllCourses } from "@/lib/xano/client";
import { getServerUser, getUserTier } from "@/lib/xano/server-auth";

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  const [courses, userTier] = await Promise.all([
    getAllCourses().catch(() => []),
    getUserTier(),
  ]);

  const firstName = user.first_name ?? "there";

  // Transform courses for existing components
  const transformedCourses = courses.map((course) => ({
    _id: String(course.id),
    title: course.title,
    slug: { current: course.slug },
    description: course.description,
    tier: course.tier,
    featured: course.featured,
    completedBy: [],
    thumbnail: course.image_url
      ? { asset: { _id: "", url: course.image_url } }
      : null,
    category: course.category_data
      ? { _id: String(course.category_data.id), title: course.category_data.title }
      : null,
    modules: [],
    moduleCount: course.module_count || 0,
    lessonCount: course.lesson_count || 0,
  }));

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-violet-600/20 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-sm text-zinc-400">Good to see you!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Welcome back, <span className="text-gradient">{firstName}</span>! 👋
          </h1>
          <p className="text-lg text-zinc-400">
            Continue your learning journey or explore new courses
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-5 mb-14" style={{ animationDelay: "0.1s" }}>
          <Link
            href="/dashboard/courses"
            className="group p-6 rounded-2xl glass border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 card-hover gradient-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-gradient transition-all">Browse Courses</h3>
            <p className="text-zinc-400 text-sm">
              Explore our full catalog of courses
            </p>
          </Link>

          <Link
            href="/dashboard/courses"
            className="group p-6 rounded-2xl glass border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all duration-300 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-fuchsia-600 to-fuchsia-700 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                <Target className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-1 text-white group-hover:text-fuchsia-400 transition-all">Track Progress</h3>
            <p className="text-zinc-400 text-sm">
              See how far you&apos;ve come
            </p>
          </Link>

          {userTier !== "ultra" ? (
            <Link
              href="/pricing"
              className="group p-6 rounded-2xl glass border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white group-hover:text-amber-400 transition-all">Upgrade to Ultra</h3>
              <p className="text-zinc-400 text-sm">
                Get AI Tutor and exclusive content
              </p>
            </Link>
          ) : (
            <div className="p-6 rounded-2xl glass border border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                  ACTIVE
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Ultra Member</h3>
              <p className="text-zinc-400 text-sm">
                You have full access to everything
              </p>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Your Courses</h2>
              <p className="text-zinc-400 mt-1">Pick up where you left off</p>
            </div>
            <Link
              href="/dashboard/courses"
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/5 text-violet-400 hover:text-violet-300 hover:border-violet-500/30 text-sm font-medium transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CourseList courses={transformedCourses} userId={String(user.id)} userTier={userTier} />
        </div>
      </main>
    </div>
  );
}
