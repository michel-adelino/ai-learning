"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, ArrowRight, Trophy, Target } from "lucide-react"
import { Header } from "@/components/Header"
import { CourseList } from "@/components/courses"

import type { Course } from "@/lib/xano/types"

interface DashboardClientProps {
  firstName: string
  userTier: string
  transformedCourses: Course[]
  userId: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function DashboardClient({ firstName, userTier, transformedCourses, userId }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/[0.02] rounded-full blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Header />

      <main className="relative z-10 px-4 sm:px-6 lg:px-12 pt-28 pb-14 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
            />
            <span className="text-sm text-muted-foreground font-medium">Good to see you!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-lg text-muted-foreground">Continue your learning journey or explore new courses</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-5 mb-16"
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/dashboard/courses"
              className="group block h-full p-6 rounded-3xl glass-card card-hover border border-white/5 hover:border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/80 to-orange-600/80 flex items-center justify-center shadow-lg shadow-amber-500/20"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all">
                Browse Courses
              </h3>
              <p className="text-muted-foreground text-sm">Explore our full catalog of courses</p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/dashboard/courses"
              className="group block h-full p-6 rounded-3xl glass-card card-hover border border-white/5 hover:border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-white/10"
                >
                  <Target className="w-6 h-6 text-muted-foreground" />
                </motion.div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all">
                Track Progress
              </h3>
              <p className="text-muted-foreground text-sm">See how far you have come</p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            {userTier !== "ultra" ? (
              <Link
                href="/pricing"
                className="group block h-full p-6 rounded-3xl glass-card card-hover border border-amber-500/20 hover:border-amber-500/30 glow-gold"
              >
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <Sparkles className="w-6 h-6 text-black" />
                  </motion.div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gradient-gold transition-all">
                  Upgrade to Ultra
                </h3>
                <p className="text-muted-foreground text-sm">Get AI Tutor and exclusive content</p>
              </Link>
            ) : (
              <div className="h-full p-6 rounded-3xl glass-card border border-emerald-500/20 glow-emerald">
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <Trophy className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="px-3 py-1.5 rounded-full glass border border-emerald-500/30 text-xs font-semibold text-emerald-400"
                  >
                    ACTIVE
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Ultra Member</h3>
                <p className="text-muted-foreground text-sm">You have full access to everything</p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gradient">Your Courses</h2>
              <p className="text-muted-foreground mt-2">Pick up where you left off</p>
            </div>
            <Link
              href="/dashboard/courses"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-muted-foreground hover:text-foreground text-sm font-medium transition-all hover:-translate-y-0.5"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CourseList courses={transformedCourses} />
        </motion.div>
      </main>
    </div>
  )
}
