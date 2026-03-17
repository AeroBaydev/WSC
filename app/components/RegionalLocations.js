"use client"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

// Video Player for regional location cards (auto-play on scroll, volume control, fullscreen)
function VideoPlayer({ videoSrc, locationName, videoId, isMuted, onToggleMute }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return
    video.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => {})
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(container)

    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === container ||
          document.webkitFullscreenElement === container ||
          document.mozFullScreenElement === container ||
          document.msFullscreenElement === container
      )
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      observer.disconnect()
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!isFullscreen) {
      if (container.requestFullscreen) container.requestFullscreen()
      else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen()
      else if (container.mozRequestFullScreen) container.mozRequestFullScreen()
      else if (container.msRequestFullscreen) container.msRequestFullscreen()
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
      else if (document.msExitFullscreen) document.msExitFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-xl group bg-gray-900/80 border border-orange-200/60"
    >
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          aria-label={`Video for ${locationName}`}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-xs font-semibold text-orange-100 backdrop-blur-sm">
          {locationName}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-orange-100">
            <span className={`h-2 w-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-orange-300"}`}></span>
            <span>{isPlaying ? "Playing" : "Paused"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleMute && onToggleMute(videoId)}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {isMuted ? (
                  <><path d="M9 9L5 12H2v0l3 0 4 3V9z" /><line x1="16" y1="9" x2="20" y2="13" /><line x1="20" y1="9" x2="16" y2="13" /></>
                ) : (
                  <><path d="M9 9L5 12H2v0l3 0 4 3V9z" /><path d="M15 9.5a4 4 0 010 5" /><path d="M17 7a8 8 0 010 10" /></>
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center justify-center h-9 px-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
              aria-label="Toggle fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
              {isFullscreen ? "Exit" : "Fullscreen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const REGIONAL_LOCATIONS = [
  { name: "GD Goenka International School, Jabalpur", state: "Madhya Pradesh", icon: "🏢", date: "29th November 2025", color: "bg-red-500", mapUrl: "https://www.google.com/maps/search/?api=1&query=GD+Goenka+International+School+Jabalpur", video: "/video/jabalpur.mp4", videoId: "jabalpur" },
  { name: "Prominence World School, Greater Noida", state: "Delhi NCR", icon: "🏙️", date: "6th December 2025", color: "bg-orange-500", mapUrl: "https://www.google.com/maps/search/?api=1&query=Prominence+World+School+Noida", video: "/video/prominence.mp4", videoId: "prominence" },
  { name: "Calcutta Public School, Kalikapur", state: "West Bengal", icon: "🏛️", date: "13th December 2025", color: "bg-red-500", mapUrl: "https://www.google.com/maps/search/?api=1&query=Calcutta+Public+School+Kalikapur+Kolkata", video: "/video/Kolkata2.mp4", videoId: "kolkata" },
  { name: "AllenHouse Public School, Rooma ", state: "Uttar Pradesh", icon: "🌆", date: "20th December 2025", color: "bg-orange-600", mapUrl: "https://www.google.com/maps/search/?api=1&query=Allen+House+Rooma+School+Kanpur", video: "/video/kanpur.mp4", videoId: "kanpur" },
  { name: "⁠Meena Bhujbal School of Excellence, Nashik", state: "Maharashtra", icon: "🏘️", date: "11th January 2026", color: "bg-red-600", mapUrl: "https://maps.app.goo.gl/ggRb49bA8K4UDZHZ8", video: "/video/wscnashik.mp4", videoId: "nashik" },
]

export default function RegionalLocations() {
  const [unmutedVideoId, setUnmutedVideoId] = useState("jabalpur")

  const handleToggleMute = (videoId) => {
    setUnmutedVideoId((prevId) => (prevId === videoId ? null : videoId))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-0"
    >
      <div className="space-y-6 md:space-y-8">
        {REGIONAL_LOCATIONS.map((location, index) => (
          <motion.div
            key={location.name}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "" : "md:flex-row-reverse"} gap-8`}
          >
            <div className="w-full md:w-1/2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-6 md:p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 ${location.color} rounded-full flex items-center justify-center mr-4 transition-transform duration-200 hover:scale-105 focus-visible:scale-105`}
                    aria-label={`Open map for ${location.name}`}
                  >
                    <span className="text-xl md:text-2xl">{location.icon}</span>
                  </a>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-orange-500">Regional: <span className="text-violet-500">{location.state} @ {location.date}</span></h3>
                    <h4 className="text-lg md:text-xl font-bold text-gray-900">{location.name}</h4>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                  Regional competition venue for {location.state} region. Students from this has competed here during the regional round.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-700 font-semibold text-sm">📍 {location.state}</p>
                </div>
              </motion.div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              {location.video ? (
                <VideoPlayer
                  videoSrc={location.video}
                  locationName={location.name}
                  videoId={location.videoId}
                  isMuted={unmutedVideoId !== location.videoId}
                  onToggleMute={handleToggleMute}
                />
              ) : (
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-16 h-16 md:w-20 md:h-20 ${location.color} rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 focus-visible:scale-110`}
                  aria-label={`Open map for ${location.name}`}
                >
                  <span className="text-2xl md:text-3xl">{location.icon}</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
