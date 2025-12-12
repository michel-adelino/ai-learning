import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Plus, BookOpen, Video, BarChart3, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getTeacherCourses } from "@/lib/xano/client"
import { Header } from "@/components/Header"

export default async function TeacherDashboardPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("xano_auth_token")?.value

  if (!authToken) {
    redirect("/auth/login")
  }

  let user
  let courses: Awaited<ReturnType<typeof getTeacherCourses>> = []

  try {
    user = await getCurrentUser(authToken)

    // Check if user is a teacher
    if (user.role !== "teacher") {
      redirect("/dashboard")
    }

    courses = await getTeacherCourses(authToken)
  } catch (error) {
    redirect("/auth/login")
  }

  const totalLessons = courses.reduce((sum, course) => {
    // Try stored count first, then calculate from lessons array
    const count = course.lesson_count || (course as any).lessons?.length || 0
    return sum + count
  }, 0)
  const totalModules = courses.reduce((sum, course) => {
    // Try stored count first, then calculate from modules array
    const count = course.module_count || (course as any).modules?.length || 0
    return sum + count
  }, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-amber-500/[0.015] rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Teacher Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
              Welcome back, {user.first_name || "Teacher"}!
            </h1>
            <p className="text-muted-foreground">Manage your courses, modules, and lessons</p>
          </div>
          <Link href="/teacher/courses/new">
            <Button className="mt-4 md:mt-0 btn-shiny bg-foreground hover:bg-foreground/90 text-background glow-white rounded-xl transition-all hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="p-6 rounded-3xl glass-card card-hover group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{courses.length}</p>
                <p className="text-muted-foreground text-sm">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card card-hover group border border-amber-500/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalLessons}</p>
                <p className="text-muted-foreground text-sm">Total Lessons</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card card-hover group border border-cyan-500/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalModules}</p>
                <p className="text-muted-foreground text-sm">Total Modules</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <span className="text-sm text-muted-foreground">{courses.length} courses</span>
          </div>

          {courses.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first course to start sharing your knowledge with students
              </p>
              <Link href="/teacher/courses/new">
                <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/teacher/courses/${course.id}`}
                  className="flex items-center justify-between p-5 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/10 transition-all">
                      {course.image_url ? (
                        <img
                          src={course.image_url || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-gradient transition-all">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.module_count || (course as any).modules?.length || 0} modules -{" "}
                        {course.lesson_count || (course as any).lessons?.length || 0} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium ${
                        course.tier === "free"
                          ? "glass text-muted-foreground"
                          : course.tier === "pro"
                            ? "glass text-foreground"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {course.tier?.toUpperCase() || "FREE"}
                    </span>
                    {course.featured && (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        Featured
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
