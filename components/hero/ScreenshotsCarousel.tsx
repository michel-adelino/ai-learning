"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"

type Slide = { src: string; alt?: string }

export default function ScreenshotsCarousel() {
  const slides: Slide[] = [
    { src: "/screenshots/landing-page.png", alt: "Landing page" },
    { src: "/screenshots/student-dashboard.png", alt: "Student dashboard" },
    { src: "/screenshots/teacher-dashboard.png", alt: "Teacher dashboard" },
    { src: "/screenshots/dashboard-updated-page.png", alt: "Dashboard updated" },
    { src: "/screenshots/course-preview-page.png", alt: "Course preview" },
    { src: "/screenshots/course-creation-page.png", alt: "Course creation" },
    { src: "/screenshots/module-creation-page.png", alt: "Module creation" },
    { src: "/screenshots/lesson-page.png", alt: "Lesson page" },
    { src: "/screenshots/lesson-creation-page.png", alt: "Lesson creation" },
    { src: "/screenshots/auth-page.png", alt: "Auth page" },
    { src: "/screenshots/settings-page.png", alt: "Settings" },
    { src: "/screenshots/pricing-page.png", alt: "Pricing" },
    { src: "/screenshots/ai-chat-preview.png", alt: "AI chat" },
    { src: "/screenshots/upgrade-complete-page.png", alt: "Upgrade complete" },
    { src: "/screenshots/mux-storage.png", alt: "MUX storage" },
    { src: "/screenshots/xano-apis.png", alt: "Xano APIs" },
    { src: "/screenshots/xano-api-scripting.png", alt: "Xano scripting" },
    { src: "/screenshots/xano-generated-swagger.png", alt: "Xano Swagger" },
    { src: "/screenshots/xano-db-schema.png", alt: "Xano DB schema" },
    { src: "/screenshots/xano-db-helper.png", alt: "Xano DB helper" },
  ]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const autoplayRef = useRef<number | null>(null)

  const next = () => setIndex((i) => (i + 1) % slides.length)
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (paused) return
    autoplayRef.current = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current)
    }
  }, [paused])

  return (
    <div className="w-full">
      <div className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/6 shadow-lg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative h-[520px] bg-black">
          {slides.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}>
              <img src={s.src} alt={s.alt || "screenshot"} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full border border-white/6 z-30">‹</button>
        <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full border border-white/6 z-30">›</button>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`w-3 h-3 rounded-full ${i === index ? "bg-emerald-400" : "bg-white/30"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
