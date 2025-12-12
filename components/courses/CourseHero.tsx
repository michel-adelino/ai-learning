import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, Play, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TIER_STYLES } from "@/lib/constants"
import type { Tier } from "@/lib/xano/types"

interface CourseHeroProps {
  title?: string | null
  description?: string | null
  tier?: Tier | null
  thumbnail?: { asset?: { _id?: string; url?: string } | null } | null
  category?: { _id?: string; title?: string | null } | null
  moduleCount?: number | null
  lessonCount?: number | null
}

export function CourseHero({
  title,
  description,
  tier,
  thumbnail,
  category,
  moduleCount,
  lessonCount,
}: CourseHeroProps) {
  const displayTier = tier ?? "free"
  const styles = TIER_STYLES[displayTier]
  const imageUrl = thumbnail?.asset?.url

  return (
    <div className="mb-14">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Thumbnail */}
        <div
          className={`relative w-full lg:w-[400px] h-60 lg:h-64 rounded-3xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center overflow-hidden shrink-0 glass-card`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-7xl opacity-30">📚</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge className={`${styles.text} ${styles.border} bg-transparent font-semibold px-4 py-1.5 rounded-full`}>
              {typeof displayTier === "string" ? displayTier.toUpperCase() : "FREE"}
            </Badge>
            {category?.title && typeof category.title === "string" && (
              <Badge variant="outline" className="border-white/10 text-muted-foreground px-4 py-1.5 rounded-full glass">
                <Tag className="w-3 h-3 mr-2" />
                {category.title}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-gradient leading-tight">
            {typeof title === "string" ? title : "Untitled Course"}
          </h1>

          {description && typeof description === "string" && (
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl">{description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border border-white/5">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{moduleCount ?? 0}</span>
              <span className="text-muted-foreground">modules</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border border-white/5">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="text-foreground font-medium">{lessonCount ?? 0}</span>
              <span className="text-muted-foreground">lessons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
