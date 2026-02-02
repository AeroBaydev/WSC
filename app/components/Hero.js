"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import Results from "./Results"

// Video Player Component
function VideoPlayer({ videoSrc, title, description, location, date, roundNumber, roundLabel, isActive, onPlay, onPause, allVideoRefs, setVideoRef }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (setVideoRef && videoRef.current) {
      setVideoRef(videoRef.current)
    }
  }, [setVideoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (onPlay) onPlay()
    }
    const handlePause = () => {
      setIsPlaying(false)
      if (onPause) onPause()
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === video ||
          document.webkitFullscreenElement === video ||
          document.mozFullScreenElement === video ||
          document.msFullscreenElement === video
      )
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [onPlay, onPause])

  // Pause this video if another one is playing
  useEffect(() => {
    if (!isActive && isPlaying && videoRef.current) {
      videoRef.current.pause()
    }
  }, [isActive, isPlaying])

  const togglePlay = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
    } else {
      // Pause all other videos first
      if (allVideoRefs) {
        allVideoRefs.forEach((ref) => {
          if (ref && ref !== video && typeof ref.pause === 'function') {
            ref.pause()
          }
        })
      }
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl border-2 transition-all duration-300 ${
        isActive 
          ? "border-orange-500 shadow-2xl shadow-orange-500/20 ring-4 ring-orange-500/10" 
          : "border-gray-200 hover:border-orange-300 hover:shadow-2xl"
      }`}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowControls(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowControls(false)
      }}
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Play/Pause Overlay - Only show when not playing or on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          initial={false}
          animate={{ 
            opacity: (isPlaying && !isHovered) ? 0 : (isHovered || !isPlaying ? 1 : 0),
            scale: (isPlaying && !isHovered) ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
          onClick={togglePlay}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-full p-6 shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.div>
        </motion.div>

        {/* Playing Indicator - Only show on hover when playing */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </motion.div>
        )}

        {/* Video Controls - Only show on hover */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
                className="p-2.5 hover:bg-white/20 rounded-full transition-all hover:scale-110 bg-white/10 backdrop-blur-sm"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <span className="text-xs font-medium">{isPlaying ? "Playing" : "Paused"}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className="p-2.5 hover:bg-white/20 rounded-full transition-all hover:scale-110 bg-white/10 backdrop-blur-sm"
              aria-label="Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </motion.div>

      </div>

      {/* Video Details */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
        <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
            <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{description}</p>
          </div>
        )}
        {date && (
          <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold mt-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{date}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(null)
  const videoRefs = useRef([])

  const videos = [
    {
      src: "/video/jabalpur.mp4",
      title: "GD Goenka International School, Jabalpur",
      description: "Regional Round - Madhya Pradesh",
      location: "Jabalpur, MP",
      date: "29th November 2025",
      roundNumber: 1,
      roundLabel: "1st Regional Round"
    },
    {
      src: "/video/prominence.mp4",
      title: "Prominence World School, Greater Noida",
      description: "Regional Round - Delhi NCR",
      location: "Noida, UP",
      date: "6th December 2025",
      roundNumber: 2,
      roundLabel: "2nd Regional Round"
    },
    {
      src: "/video/Kolkata2.mp4",
      title: "Calcutta Public School, Kalikapur",
      description: "Regional Round - West Bengal",
      location: "Kolkata, WB",
      date: "13th December 2025",
      roundNumber: 3,
      roundLabel: "3rd Regional Round"
    },
    {
      src: "/video/wscnashik.mp4",
      title: "Meena Bhujbal School of Excellence, Nashik",
      description: "Regional Round - Maharashtra",
      location: "Nashik, MH",
      date: "11th January 2026",
      roundNumber: 4,
      roundLabel: "4th Regional Round"
    }
  ]

  const handleVideoPlay = (index) => {
    setActiveVideoIndex(index)
    // Pause all other videos
    videoRefs.current.forEach((ref, i) => {
      if (ref && ref.current && i !== index) {
        ref.current.pause()
      }
    })
  }

  const handleVideoPause = () => {
    setActiveVideoIndex(null)
  }

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
                World Skill Challenge 2025
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
                  Register Now
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

      {/* WSC 2025 Videos Section */}
      <section className="py-24 bg-top bg-repeat relative overflow-hidden" style={{backgroundImage: 'url(/images/stagesbg.jpg)', backgroundSize: '50%'}}>
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-white/80"></div>
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="text-orange-500 font-bold text-sm uppercase tracking-wider bg-orange-100 px-4 py-2 rounded-full">
                Regional Highlights
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent">
              WSC 2025
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the excitement and energy of World Skill Challenge 2025 through our regional round highlights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {videos.map((video, index) => (
              <VideoPlayer
                key={video.src}
                videoSrc={video.src}
                title={video.title}
                description={video.description}
                location={video.location}
                date={video.date}
                roundNumber={video.roundNumber}
                roundLabel={video.roundLabel}
                isActive={activeVideoIndex === index}
                onPlay={() => handleVideoPlay(index)}
                onPause={handleVideoPause}
                allVideoRefs={videoRefs.current}
                setVideoRef={(ref) => {
                  if (ref) {
                    videoRefs.current[index] = ref
                  }
                }}
              />
            ))}
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">🎬 Watch More Highlights</h3>
              <p className="text-lg text-orange-100 max-w-2xl mx-auto">
                Stay tuned for more exciting moments from our regional rounds and national finale!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <Results />
    </>
  )
}
