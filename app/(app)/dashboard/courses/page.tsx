import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { Header } from "@/components/Header"
import { CourseCard } from "@/components/courses"
import { getAllCourses } from "@/lib/xano/client"
import { getServerUser, getUserTier } from "@/lib/xano/server-auth"

export default async function MyCoursesPage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/")
  }

  const userTier = await getUserTier()

  let courses: Awaited<ReturnType<typeof getAllCourses>> = []
  try {
    courses = await getAllCourses()
  } catch (error) {
    console.error("Error fetching courses:", error)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/[0.03] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/[0.02] rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 pt-28 pb-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm text-muted-foreground font-medium">Course Catalog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">All Courses</h1>
          <p className="text-muted-foreground">Explore our full catalog of courses and start learning</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div key={course.slug} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard
                  title={course.title}
                  slug={course.slug}
                  description={course.description}
                  tier={course.tier}
                  image_url={course.image_url}
                  moduleCount={course.module_count || 0}
                  lessonCount={course.lesson_count || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No courses available yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Check back soon for new courses, or contact us if you think this is an error.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
