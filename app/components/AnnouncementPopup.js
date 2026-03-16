"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hasSeen = window.sessionStorage.getItem("wsc-2026-announcement-shown")
    if (!hasSeen) {
      setIsOpen(true)
      window.sessionStorage.setItem("wsc-2026-announcement-shown", "true")
    }

    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-label="WSC 2026 announcement"
        >
          <motion.div
            className="relative max-w-lg w-[90%] md:w-[480px] bg-white/95 rounded-2xl shadow-2xl border border-orange-100 p-6 md:p-8"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <button
              type="button"
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close announcement"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-5 h-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              WSC India 2026 · Coming Soon
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
              Get ready for <span className="text-orange-600">World Skill Challenge 2026</span>!
            </h2>

            <p className="text-sm md:text-base text-gray-700 mb-4">
              A bigger, bolder WSC is on the way with{" "}
              <span className="font-semibold">brand new categories, fresh locations</span> across India, and
              even more opportunities to showcase your skills.
            </p>

            <ul className="list-disc list-inside text-xs md:text-sm text-gray-700 space-y-1 mb-5">
              <li>Expanded competition tracks for innovators and builders</li>
              <li>More cities, more stages, more recognition</li>
              <li>Upgraded challenges designed for WSC India 2026</li>
            </ul>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm md:text-base font-semibold text-white shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Close WSC 2026 announcement"
              onClick={() => setIsOpen(false)}
            >
              I&apos;m ready for WSC India 2026
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

