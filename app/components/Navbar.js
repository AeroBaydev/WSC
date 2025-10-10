"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { label: "About", anchor: "about" },
    { label: "ExperienceX", anchor: "experiencex" },
    { label: "SoarFest", anchor: "soarfest" },
    { label: "Stages", anchor: "stages" },
    // { label: "Market Place", anchor: "MarketPlace" }, // <-- Add this line
    { label: "Register", anchor: "register" },
    { label: "Contact", anchor: "contact" },
  ]

  // Handle scroll behavior for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Always show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true)
      }
      // Hide navbar when scrolling up, show when scrolling down
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true) // Scrolling up - show navbar
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Scrolling down - hide navbar
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const handleNavigation = (item) => {
    const section = item.anchor
    if (pathname === "/") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(`/#${section}`)
    }
    setIsOpen(false)
    setIsMoreOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-orange-500 p-1 rounded-lg">
              <Image
                src="/images/wsc-logo.png"
                alt="World Skill Challenge Logo"
                width={60}
                height={60}
                className="object-contain bg-white rounded-md"
              />
            </div>
            <div className="text-xl font-bold text-gray-900">World Skill Challenge</div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavigation(item)}
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </motion.button>
            ))}

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  {/* <a
                    href="https://workdrive.zoho.in/folder/1nsamfc18e91dad8f439fafa11477539db613"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    Guidelines
                  </a> */}
                  <button
                    onClick={() => {
                      router.push("/updates")
                      setIsMoreOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    Updates
                  </button>
                  <button
                    onClick={() => {
                      router.push("/faq")
                      setIsMoreOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    FAQ
                  </button>
                </motion.div>
              )}
            </div>

            <div className="ml-4 flex items-center">
              {isSignedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden lg:block">Welcome, {user?.firstName || "User"}</span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 rounded-full border-2 border-orange-500 hover:border-orange-600 transition-colors",
                        userButtonPopoverCard: "shadow-lg border border-gray-200",
                        userButtonPopoverActionButton: "hover:bg-orange-50 text-gray-700",
                        userButtonPopoverActionButtonText: "text-gray-700",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border-2 border-orange-500",
                    userButtonPopoverCard: "shadow-lg border border-gray-200",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-orange-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white rounded-lg mt-2 p-4 shadow-lg border border-gray-100"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="block w-full text-left text-gray-700 hover:text-orange-500 py-2 text-base font-medium"
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="text-sm font-medium text-gray-900 mb-2">More</div>
              <a
                href="https://workdrive.zoho.in/folder/1nsamfc18e91dad8f439fafa11477539db613"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-orange-500 py-1 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Guidelines
              </a>
              <button
                onClick={() => {
                  router.push("/updates")
                  setIsOpen(false)
                }}
                className="block w-full text-left text-gray-700 hover:text-orange-500 py-1 text-sm"
              >
                Updates
              </button>
              <button
                onClick={() => {
                  router.push("/faq")
                  setIsOpen(false)
                }}
                className="block w-full text-left text-gray-700 hover:text-orange-500 py-1 text-sm"
              >
                FAQ
              </button>
            </div>

            {isSignedIn && (
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="text-sm text-gray-600">Signed in as {user?.firstName || "User"}</div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
