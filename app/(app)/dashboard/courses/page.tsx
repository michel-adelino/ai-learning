import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/courses";
import { getAllCourses } from "@/lib/xano/client";
import { getServerUser, getUserTier } from "@/lib/xano/server-auth";

export default async function MyCoursesPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  const userTier = await getUserTier();

  let courses: Awaited<ReturnType<typeof getAllCourses>> = [];
  try {
    courses = await getAllCourses();
  } catch (error) {
    console.error("Error fetching courses:", error);
  }

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
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2">All Courses</h1>
          <p className="text-zinc-400">
            Explore our full catalog of courses and start learning
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.slug}
                title={course.title}
                slug={course.slug}
                description={course.description}
                tier={course.tier}
                image_url={course.image_url}
                moduleCount={course.module_count || 0}
                lessonCount={course.lesson_count || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No courses available yet
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              Check back soon for new courses, or contact us if you think this is an error.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
