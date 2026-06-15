"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import StatsCounter from "./StatsCounter"
import RegionalLocations from "./RegionalLocations"
import ChiefGuestJudgesCarousel from "./ChiefGuestJudgesCarousel"
import { REGISTRATION_OPEN, REGISTRATION_CLOSED_MESSAGE } from "@/lib/registrationConfig"

async function attemptPlay(video, { unmuted }) {
  if (!video) return { ok: false }
  video.muted = !unmuted
  try {
    await video.play()
    return { ok: true }
  } catch (err) {
    return { ok: false, err }
  }
}

// Nationals full-width video using local MP4 with auto-play on scroll
function NationalsVideoPlayer({ setVideoRef, onAutoPlayStart }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsUserGesture, setNeedsUserGesture] = useState(false)

  useEffect(() => {
    if (setVideoRef && videoRef.current) {
      setVideoRef(videoRef.current)
    }
  }, [setVideoRef])

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            onAutoPlayStart?.()

            // Autoplay with sound where allowed; fall back to muted autoplay + prompt.
            const res = await attemptPlay(video, { unmuted: true })
            if (!res.ok) {
              await attemptPlay(video, { unmuted: false })
              setNeedsUserGesture(true)
            } else {
              setNeedsUserGesture(false)
            }

            setIsPlaying(true)
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300 bg-gray-900 group shadow-[0_0_45px_rgba(0,0,0,0.6)]"
    >
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src="/video/nationals.mp4"
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          loop
          controls
        />

        {/* Play state pill (matches theme, no dark strip at bottom) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <span
            className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-orange-300"
              }`}
          ></span>
          <span>{isPlaying ? "Playing" : "Paused"}</span>
        </div>

        {needsUserGesture && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
            <button
              onClick={async (e) => {
                e.stopPropagation()
                const video = videoRef.current
                if (!video) return
                const res = await attemptPlay(video, { unmuted: true })
                if (res.ok) setNeedsUserGesture(false)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500/95 hover:bg-orange-600 text-white px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm transition-colors"
            >
              Enable sound
            </button>
          </div>
        )}

        {/* Minimal bottom info text without black shadow */}
        <div className="absolute bottom-4 left-4 text-xs md:text-sm text-orange-100">
          <p className="font-semibold">Nationals Finale • 25th January 2026</p>
          <p>The Modern School, Faridabad</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const nationalsVideoElRef = useRef(null)
  const testimonialsContainerRef = useRef(null)
  const testimonialsVideoRef = useRef(null)
  const [isTestimonialsPlaying, setIsTestimonialsPlaying] = useState(false)
  const [testimonialsNeedsUserGesture, setTestimonialsNeedsUserGesture] = useState(false)

  useEffect(() => {
    const container = testimonialsContainerRef.current
    const video = testimonialsVideoRef.current
    if (!container || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            if (nationalsVideoElRef.current && typeof nationalsVideoElRef.current.pause === "function") {
              nationalsVideoElRef.current.pause()
            }

            // Autoplay with sound where allowed; fall back to muted autoplay + prompt.
            const res = await attemptPlay(video, { unmuted: true })
            if (!res.ok) {
              await attemptPlay(video, { unmuted: false })
              setTestimonialsNeedsUserGesture(true)
            } else {
              setTestimonialsNeedsUserGesture(false)
            }

            setIsTestimonialsPlaying(true)
          } else {
            // Pause when scrolled away
            video.pause()
            setIsTestimonialsPlaying(false)
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.png"
            alt="Tech Innovation Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/70"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex-shrink-0"
            >
              <Image
                src="/images/wsc-logo.png"
                alt="World Skill Challenge Logo"
                width={300}
                height={300}
                className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
              />
            </motion.div>

            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                World Skill Challenge 
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-500 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Crafting Champions of Tomorrow
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                A national and international skill hunt for students across age groups, blending innovation, teamwork, and
                real-world problem solving. Compete in exciting categories with cash prizes up to ₹1-Lakh!
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  {REGISTRATION_OPEN ? "Register Now" : REGISTRATION_CLOSED_MESSAGE}
                </motion.a>
                <motion.a
                  href="/experiencex"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  View Categories
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Nationals 2025 Highlight + Participation Data (same section, less gap) */}
      <section className="pt-14 md:pt-16 pb-10 md:pb-12 bg-top bg-repeat relative overflow-hidden" style={{ backgroundImage: 'url(/images/stagesbg.jpg)', backgroundSize: '50%' }}>
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <span className="text-orange-500 font-bold text-sm uppercase tracking-wider bg-orange-100 px-4 py-2 rounded-full">
                Nationals Highlight
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
              WSC Nationals 2025
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Relive the energy and innovation from the National Finale at The Modern School, Faridabad.
            </p>
          </motion.div>

          <NationalsVideoPlayer
            setVideoRef={(el) => {
              nationalsVideoElRef.current = el
            }}
            onAutoPlayStart={() => {
              if (testimonialsVideoRef.current && typeof testimonialsVideoRef.current.pause === "function") {
                testimonialsVideoRef.current.pause()
              }
            }}
          />

          <StatsCounter variant="homeBelowNationals" />
        </div>
      </section>

      {/* Regional Locations – same heading style as Nationals */}
      <section className="pt-10 md:pt-12 pb-14 md:pb-16 bg-top bg-repeat relative overflow-hidden" style={{ backgroundImage: 'url(/images/stagesbg.jpg)', backgroundSize: '50%' }}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <span className="text-orange-500 font-bold text-sm uppercase tracking-wider bg-orange-100 px-4 py-2 rounded-full">
                Regional Highlights
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
              WSC Regional 2025
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Regional rounds has been conducted across multiple cities in India
            </p>
          </motion.div>

          <RegionalLocations />

          {/* Testimonials – same heading style, less gap */}
          <motion.div
            ref={testimonialsContainerRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 max-w-6xl mx-auto"
          >
            <div className="text-center mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wider">
                Testimonials
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
                WSC Testimonials 2025
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real experiences from schools, students, and educators who joined World Skill Challenge.
              </p>
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300 bg-gray-900">
              <video
                ref={testimonialsVideoRef}
                src="/video/testimonial.mp4"
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
              />

              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                <span
                  className={`w-2 h-2 rounded-full ${isTestimonialsPlaying ? "bg-green-400 animate-pulse" : "bg-orange-300"
                    }`}
                ></span>
                <span>{isTestimonialsPlaying ? "Playing" : "Paused"}</span>
              </div>

              {testimonialsNeedsUserGesture && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      const video = testimonialsVideoRef.current
                      if (!video) return
                      const res = await attemptPlay(video, { unmuted: true })
                      if (res.ok) setTestimonialsNeedsUserGesture(false)
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500/95 hover:bg-orange-600 text-white px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm transition-colors"
                  >
                    Enable sound
                  </button>
                </div>
              )}
            </div>

            <ChiefGuestJudgesCarousel />
          </motion.div>
        </div>
      </section>
    </>
  )
}
