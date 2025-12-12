"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CourseCard } from "./CourseCard"
import { TierFilterTabs, type TierFilter } from "./TierFilterTabs"
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier-xano"
import type { Course } from "@/lib/xano/types"
import { motion } from "framer-motion"

// Course type for the list
export type CourseListCourse = Course

interface CourseListProps {
  courses: CourseListCourse[]
  showFilters?: boolean
  showSearch?: boolean
  emptyMessage?: string
}

export function CourseList({
  courses,
  showFilters = true,
  showSearch = true,
  emptyMessage = "No courses found",
}: CourseListProps) {
  const userTier = useUserTier()
  const [tierFilter, setTierFilter] = useState<TierFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on tier and search query
  const filteredCourses = courses.filter((course) => {
    // Tier filter
    if (tierFilter !== "all" && course.tier !== tierFilter) {
      return false
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const title = course.title?.toLowerCase() ?? ""
      const description = course.description?.toLowerCase() ?? ""
      if (!title.includes(query) && !description.includes(query)) {
        return false
      }
    }

    return true
  })

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {showFilters && <TierFilterTabs activeFilter={tierFilter} onFilterChange={setTierFilter} />}

          {showSearch && (
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 glass border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-white/20 rounded-xl"
              />
            </div>
          )}
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.slug}
              slug={course.slug}
              title={course.title}
              description={course.description}
              tier={course.tier}
              image_url={course.image_url}
              moduleCount={course.module_count}
              lessonCount={course.lesson_count}
              isLocked={!hasTierAccess(userTier, course.tier)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-5">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">{emptyMessage}</p>
          {(tierFilter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setTierFilter("all")
                setSearchQuery("")
              }}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg glass"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
