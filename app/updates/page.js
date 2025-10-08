import Navbar from "../components/Navbar"
import Updates from "../components/Updates"
import Footer from "../components/Footer"

export const metadata = {
  title: "Latest Updates & News",
  description: "Stay updated with the latest news, announcements, and updates about World Skill Challenge 2025. Get information about competition dates, registration deadlines, and important notifications.",
  keywords: [
    "World Skill Challenge updates",
    "WSC 2025 news",
    "competition announcements",
    "student competition updates",
    "robotics competition news",
    "IDEA IGNITE updates",
    "MYSTERY MAKERS news",
    "TECH FOR GOOD updates",
    "TECH THROTTLE news"
  ].join(", "),
  alternates: {
    canonical: "https://worldskillchallenge.com/updates",
  },
  openGraph: {
    title: "Latest Updates & News - World Skill Challenge 2025",
    description: "Stay updated with the latest news, announcements, and updates about World Skill Challenge 2025.",
    url: "https://worldskillchallenge.com/updates",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Latest Updates & News - World Skill Challenge 2025",
    description: "Stay updated with the latest news and announcements about World Skill Challenge 2025.",
  },
}

export default function UpdatesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Updates />
      <Footer />
    </div>
  )
}
