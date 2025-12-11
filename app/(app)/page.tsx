import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/courses";
import {
  ArrowRight,
  Play,
  BookOpen,
  Code2,
  Rocket,
  Crown,
  CheckCircle2,
  Star,
  Users,
  Trophy,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { getFeaturedCourses, getPlatformStats } from "@/lib/xano/client";
import { getServerUser } from "@/lib/xano/server-auth";

export default async function Home() {
  // Fetch featured courses, stats, and check auth status
  const [courses, stats, user] = await Promise.all([
    getFeaturedCourses().catch(() => []),
    getPlatformStats().catch(() => ({ course_count: 0, lesson_count: 0 })),
    getServerUser(),
  ]);

  const isSignedIn = !!user;

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[30%] right-[15%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[30%] left-[10%] w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "0.5s" }}
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

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 lg:px-12 pt-20 pb-28 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-violet-500/30 mb-10 animate-fade-in-up shadow-lg shadow-violet-500/10"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-sm font-medium text-violet-300">
                Learn to code with real-world projects
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tight leading-[0.9] mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="block text-white drop-shadow-2xl">Master coding</span>
              <span className="block text-gradient animate-gradient-x">
                the modern way
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Join Simply Learn and learn from expertly crafted courses,
              modules, and hands-on lessons. From free fundamentals to{" "}
              <span className="text-fuchsia-400 font-medium">Pro exclusives</span> and{" "}
              <span className="text-cyan-400 font-medium">Ultra gems</span>.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.25s" }}
            >
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="group relative bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-[1.02] animate-glow-pulse"
                    >
                      <LayoutDashboard className="mr-2 w-5 h-5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/courses">
                    <Button
                      size="lg"
                      variant="outline"
                      className="glass border-white/10 text-zinc-200 hover:bg-white/5 hover:text-white hover:border-white/20 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300"
                    >
                      <BookOpen className="mr-2 w-5 h-5" />
                      View All Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="group relative bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-[1.02] animate-glow-pulse"
                    >
                      <Play className="mr-2 w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#courses">
                    <Button
                      size="lg"
                      variant="outline"
                      className="glass border-white/10 text-zinc-200 hover:bg-white/5 hover:text-white hover:border-white/20 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300"
                    >
                      <BookOpen className="mr-2 w-5 h-5" />
                      Browse Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-14 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-sm text-zinc-300 font-medium">{stats.course_count}+ Courses</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass border border-white/5">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-zinc-300 font-medium">{stats.lesson_count}+ Lessons</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass border border-white/5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm text-zinc-300 font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section
          id="courses"
          className="px-6 lg:px-12 py-24 max-w-7xl mx-auto"
        >
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Courses
              </h2>
              <p className="text-zinc-400 max-w-xl">
                Hand-picked courses to kickstart your coding journey
              </p>
            </div>
            <Link
              href="/dashboard/courses"
              className="hidden md:flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  _id: String(course.id),
                  title: course.title,
                  slug: { current: course.slug },
                  description: course.description,
                  tier: course.tier,
                  thumbnail: course.image_url
                    ? { asset: { _id: "", url: course.image_url } }
                    : null,
                  moduleCount: course.module_count || 0,
                  lessonCount: course.lesson_count || 0,
                }}
              />
            ))}
          </div>

          {/* Mobile "View all" link */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Pricing Tiers Preview */}
        <section className="px-6 lg:px-12 py-24 border-t border-zinc-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your Path
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Start free, unlock more as you grow
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Perfect for getting started
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Access to free courses
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Community support
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="p-6 rounded-2xl bg-linear-to-b from-violet-500/10 to-transparent border border-violet-500/30 hover:border-violet-500/50 transition-colors relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-500 text-xs font-semibold">
                  Popular
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  For serious learners
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    Access to Pro courses
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    Priority support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>

              {/* Ultra Tier */}
              <div className="p-6 rounded-2xl bg-linear-to-b from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ultra</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  The complete experience
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    AI Tutor access
                  </li>
                  <li className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    1-on-1 mentorship
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                    Go Ultra
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="px-6 lg:px-12 py-24 border-t border-zinc-800/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Developers
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Join thousands of developers who&apos;ve transformed their
                careers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Alex Chen",
                  role: "Frontend Developer",
                  content:
                    "The courses here completely changed how I approach web development. The hands-on projects are incredible!",
                  rating: 5,
                },
                {
                  name: "Sarah Kim",
                  role: "Full Stack Engineer",
                  content:
                    "Best investment I've made in my career. The AI tutor is like having a mentor available 24/7.",
                  rating: 5,
                },
                {
                  name: "Marcus Johnson",
                  role: "Software Engineer",
                  content:
                    "From beginner to landing my dream job in 6 months. The structured learning path made all the difference.",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-4">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-24 border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              Join thousands of developers learning to code the modern way
            </p>
            <Link href={isSignedIn ? "/dashboard" : "/auth/signup"}>
              <Button
                size="lg"
                className="group bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105"
              >
                <Trophy className="mr-2 w-5 h-5" />
                {isSignedIn ? "Continue Learning" : "Get Started Free"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-8 border-t border-zinc-800/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-r from-violet-600 to-fuchsia-600 p-1.5 rounded-lg">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-zinc-400">
                © 2024 Simply Learn
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
