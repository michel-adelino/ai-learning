import { notFound } from "next/navigation"
import { LessonPageContent } from "@/components/lessons"
import { getLessonBySlug } from "@/lib/xano/client"
import { getServerUser } from "@/lib/xano/server-auth"

interface LessonPageProps {
  params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params
  const user = await getServerUser()

  let lesson
  try {
    lesson = await getLessonBySlug(slug)
  } catch (error) {
    console.error("Error fetching lesson:", error)
    notFound()
  }

  if (!lesson) {
    notFound()
  }

  // Get completed lesson IDs (for now empty, would need progress API)
  const completedLessonIds: number[] = []

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 pt-8 pb-10 max-w-7xl mx-auto">
        <LessonPageContent lesson={lesson} userId={user?.id || null} completedLessonIds={completedLessonIds} />
      </main>
    </div>
  )
}
