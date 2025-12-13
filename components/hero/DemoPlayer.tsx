"use client"

import React, { useState } from "react"
import Image from "next/image"

export default function DemoPlayer() {
  const [playing, setPlaying] = useState(false)
  const poster = "/screenshots/landing-page.png"
  const videoId = "r6rAGLxCMT0"

  return (
    <div className="relative hidden lg:flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
      <div className="w-[820px] max-w-full rounded-3xl overflow-hidden shadow-2xl border border-white/6 transform transition-transform hover:-translate-y-3 bg-black">
        {!playing ? (
          <button
            aria-label="Play demo video"
            onClick={() => setPlaying(true)}
            className="relative block w-full h-0 pb-[56.25%] focus:outline-none bg-black"
          >
            <Image src={poster} alt="Demo cover" fill className="object-cover brightness-70" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl transform transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10 ml-0.5">
                  <path d="M4.5 3.5v17l15-8.5-15-8.5z" />
                </svg>
              </div>
            </div>

          </button>
        ) : (
          <div className="relative pb-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Simply Learn — Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  )
}
