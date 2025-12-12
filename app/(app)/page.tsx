import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { CourseCard } from "@/components/courses"
import {
  ArrowRight,
  Play,
  Rocket,
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Users,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  GraduationCap,
} from "lucide-react"
import { getFeaturedCourses, getPlatformStats } from "@/lib/xano/client"
import { getServerUser } from "@/lib/xano/server-auth"

const features = [
  {
    icon: Zap,
    title: "Learn by Doing",
    description: "Hands-on projects and real-world challenges that build practical skills.",
  },
  {
    icon: Target,
    title: "Structured Paths",
    description: "Clear learning roadmaps from beginner to expert in any subject.",
  },
  {
    icon: Shield,
    title: "Expert Content",
    description: "Courses crafted by industry professionals with real experience.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow learners and get help when you need it.",
  },
]

const statsData = [
  { value: "X+", label: "Courses" },
  { value: "Y+", label: "Lessons" },
  { value: "Z+", label: "Students" },
]

const testimonials = [
  {
    quote: "ABC testimonial quote here.",
    author: "John Doe",
    role: "Software Engineer",
    avatar: "JD",
  },
  {
    quote: "DEF testimonial quote here.",
    author: "Jane Smith",
    role: "Product Manager",
    avatar: "JS",
  },
  {
    quote: "GHI testimonial quote here.",
    author: "Bob Johnson",
    role: "UX Designer",
    avatar: "BJ",
  },
]

export default async function Home() {
  const user = await getServerUser()

  if (user) {
    redirect("/dashboard")
  }

  const [courses, stats] = await Promise.all([
    getFeaturedCourses().catch(() => []),
    getPlatformStats().catch(() => ({ course_count: 0, lesson_count: 0 })),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/[0.02] rounded-full blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Header />

      <main className="relative z-10">
        <section className="px-6 lg:px-12 pt-32 pb-20 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left side - Text content */}
            <div className="flex flex-col">
              {/* Announcement badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 w-fit animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-muted-foreground font-medium">New courses every week</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>

              {/* Main headline - General learning, not coding */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="text-gradient">Master skills</span>
                <br />
                <span className="text-muted-foreground">the modern way</span>
              </h1>

              <p
                className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                Learn with structured courses, hands-on projects, and AI-powered assistance. From beginner to pro, we've
                got your journey covered.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="btn-shiny bg-foreground text-background hover:bg-foreground/90 px-6 py-5 text-base font-semibold rounded-xl transition-all duration-300 group"
                  >
                    <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Start Learning Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 py-5 text-base font-medium rounded-xl glass border-white/10 hover:bg-white/5 hover:border-white/20 transition-all bg-transparent text-foreground"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {statsData.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    {i < statsData.length - 1 && <div className="w-px h-8 bg-white/10 ml-4" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Floating lesson preview card */}
            <div
              className="relative hidden lg:flex items-center justify-center animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              {/* Main lesson card */}
              <div className="relative animate-float-card">
                <div className="lesson-card rounded-2xl p-1 w-[380px]">
                  {/* Window header with traffic lights */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <div className="traffic-dot traffic-red" />
                    <div className="traffic-dot traffic-yellow" />
                    <div className="traffic-dot traffic-green" />
                  </div>

                  {/* Lesson content preview */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-mono">// Your learning journey</p>
                      <p className="font-mono text-sm">
                        <span className="text-purple-400">const</span> <span className="text-emerald-400">learn</span>{" "}
                        <span className="text-white">=</span> <span className="text-amber-400">async</span>{" "}
                        <span className="text-white">{"() => {"}</span>
                      </p>
                      <p className="font-mono text-sm pl-4">
                        <span className="text-purple-400">await</span> <span className="text-blue-400">practice</span>
                        <span className="text-white">();</span>
                      </p>
                      <p className="font-mono text-sm pl-4">
                        <span className="text-purple-400">return</span>{" "}
                        <span className="text-emerald-300">'success'</span>
                        <span className="text-white">;</span>
                      </p>
                      <p className="font-mono text-sm">
                        <span className="text-white">{"};"}</span>
                      </p>
                    </div>

                    {/* Play button overlay */}
                    <div className="flex items-center justify-center py-4">
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center border border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                        <Play className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating progress badge */}
                <div className="absolute -top-4 -right-4 animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-background" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-sm font-semibold text-foreground">12 lessons done</p>
                    </div>
                  </div>
                </div>

                {/* Floating AI Tutor badge */}
                <div className="absolute -bottom-4 -left-8 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-amber-500/20 glow-gold">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-background" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AI Tutor</p>
                      <p className="text-sm font-semibold text-foreground">Always ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mb-20" />

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm text-emerald-400 font-medium">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete learning ecosystem designed to help you master new skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group glass-card rounded-2xl p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        {courses.length > 0 && (
          <section id="courses" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 text-sm text-muted-foreground font-medium">
                  <BookOpen className="w-4 h-4" />
                  Featured Courses
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-gradient">Start your journey</h2>
              </div>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-0.5 group"
              >
                View all courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  slug={course.slug}
                  description={course.description}
                  tier={course.tier}
                  image_url={course.image_url}
                  moduleCount={course.module_count || 0}
                  lessonCount={course.lesson_count || 0}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm text-amber-400 font-medium">
              <Star className="w-4 h-4 fill-amber-400" />
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-4">Loved by learners</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our students have to say about their learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className="glass-card rounded-2xl p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 lg:px-12 py-24">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20 max-w-7xl mx-auto" />

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm text-foreground font-medium">
                <TrendingUp className="w-4 h-4" />
                Pricing
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-4">Choose your path</h2>
              <p className="text-muted-foreground text-lg">Start free, upgrade when you're ready</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className="group p-7 rounded-3xl glass-card card-hover">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-3xl font-bold text-foreground mb-1">$0</div>
                <p className="text-muted-foreground text-sm mb-7">Forever free</p>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                    Access to free courses
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                    Community support
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                    Progress tracking
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button
                    className="w-full btn-shiny rounded-xl py-5 glass border-white/10 hover:bg-white/5 text-foreground bg-transparent"
                    variant="outline"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="group p-7 rounded-3xl glass-card card-hover relative border border-emerald-500/30 glow-emerald animate-border-glow">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-emerald-500 text-background text-xs font-bold shadow-lg">
                  Most Popular
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-7 h-7 text-background" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold text-foreground mb-1">
                  $29<span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground text-sm mb-7">For serious learners</p>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    All Pro courses
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Certificate of completion
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full btn-shiny bg-emerald-500 text-background hover:bg-emerald-400 font-semibold rounded-xl py-5 glow-emerald">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>

              {/* Ultra Tier */}
              <div className="group p-7 rounded-3xl glass-card card-hover border border-amber-500/20 glow-gold">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-7 h-7 text-background" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ultra</h3>
                <div className="text-3xl font-bold text-foreground mb-1">
                  $79<span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground text-sm mb-7">The complete experience</p>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    AI Tutor access
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    1-on-1 mentorship
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    Career coaching
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full btn-shiny bg-gradient-to-r from-amber-400 to-amber-500 text-background hover:from-amber-300 hover:to-amber-400 font-semibold rounded-xl py-5">
                    Go Ultra
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-400/5" />
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative glass-card border-emerald-500/20 rounded-3xl p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-6">Ready to start learning?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of learners who are mastering new skills and advancing their careers.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="btn-shiny bg-emerald-500 text-background hover:bg-emerald-400 px-8 py-6 text-lg font-semibold rounded-2xl glow-emerald"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Simply Learn. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
