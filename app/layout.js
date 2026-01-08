import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "World Skill Challenge 2025 - Crafting Champions of Tomorrow | National & International Competition",
    template: "%s | World Skill Challenge 2025"
  },
  description:
    "Join World Skill Challenge 2025! National & international skill hunt for students. Compete in IDEA IGNITE, MYSTERY MAKERS, TECH FOR GOOD, TECH THROTTLE. Cash prizes up to ₹1-Lakh! Register now.",
  keywords: [
    "World Skill Challenge 2025",
    "student competition India",
    "robotics competition",
    "national competition students",
    "international competition",
    "IDEA IGNITE",
    "MYSTERY MAKERS",
    "TECH FOR GOOD",
    "TECH THROTTLE",
    "student innovation contest",
    "school competition",
    "cash prizes students",
    "robotics contest India",
    "RC car competition",
    "BattleBot competition",
    "research competition students",
    "engineering competition",
    "technology competition",
    "STEAM competition",
    "aeromodelling competition",
    "skill development",
    "young innovators",
    "student entrepreneurship",
  ].join(", "),
  authors: [{ name: "World Skill Challenge Team" }],
  creator: "World Skill Challenge",
  publisher: "World Skill Challenge",
  metadataBase: new URL('https://worldskillchallenge.com'),
  alternates: {
    canonical: 'https://worldskillchallenge.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://worldskillchallenge.com',
    title: 'World Skill Challenge 2025 - Crafting Champions of Tomorrow',
    description: 'Join World Skill Challenge 2025! National & international skill hunt for students. Compete in IDEA IGNITE, MYSTERY MAKERS, TECH FOR GOOD, TECH THROTTLE. Cash prizes up to ₹1-Lakh!',
    siteName: 'World Skill Challenge 2025',
    images: [
      {
        url: '/images/wsc-logo.png',
        width: 1200,
        height: 630,
        alt: 'World Skill Challenge 2025 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Skill Challenge 2025 - Crafting Champions of Tomorrow',
    description: 'Join World Skill Challenge 2025! National & international skill hunt for students. Compete in IDEA IGNITE, MYSTERY MAKERS, TECH FOR GOOD, TECH THROTTLE.',
    images: ['/images/wsc-logo.png'],
    creator: '@wsc_india',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="icon" href="/images/wsc-logo.png" />
          <link rel="shortcut icon" href="/images/wsc-logo.png" />
          <link rel="apple-touch-icon" href="/images/wsc-logo.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ff6b35" />
          <meta name="msapplication-TileColor" content="#ff6b35" />
          <meta name="msapplication-TileImage" content="/images/wsc-logo.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="application-name" content="World Skill Challenge 2025" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="WSC 2025" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="geo.region" content="IN" />
          <meta name="geo.country" content="India" />
          <meta name="geo.placename" content="India" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        </head>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
