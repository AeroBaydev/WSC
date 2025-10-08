import FAQ from "../components/FAQ"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export const metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to frequently asked questions about World Skill Challenge 2025. Learn about registration, competition categories, prizes, and more.",
  keywords: [
    "World Skill Challenge FAQ",
    "WSC 2025 questions",
    "competition registration help",
    "student competition FAQ",
    "robotics competition questions",
    "IDEA IGNITE FAQ",
    "MYSTERY MAKERS FAQ",
    "TECH FOR GOOD FAQ",
    "TECH THROTTLE FAQ"
  ].join(", "),
  alternates: {
    canonical: "https://worldskillchallenge.com/faq",
  },
  openGraph: {
    title: "FAQ - World Skill Challenge 2025",
    description: "Find answers to frequently asked questions about World Skill Challenge 2025. Learn about registration, competition categories, prizes, and more.",
    url: "https://worldskillchallenge.com/faq",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAQ - World Skill Challenge 2025",
    description: "Find answers to frequently asked questions about World Skill Challenge 2025.",
  },
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is World Skill Challenge 2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "World Skill Challenge 2025 is a national and international skill hunt for students across different age groups, featuring competitions in IDEA IGNITE, MYSTERY MAKERS, TECH FOR GOOD, and TECH THROTTLE categories."
      }
    },
    {
      "@type": "Question",
      name: "What are the competition categories?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The competition has four main categories: IDEA IGNITE (Research-Based Individual), MYSTERY MAKERS (STEAM + Kit-Based Team), TECH FOR GOOD (Robotics Team), and TECH THROTTLE (Gaming - RC Cars + BattleBots)."
      }
    },
    {
      "@type": "Question",
      name: "What are the prizes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cash prizes up to ₹1 Lakh are available for winners across different categories, along with trophies, certificates, and recognition."
      }
    },
    {
      "@type": "Question",
      name: "When does registration close?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Registration closes on 15th October 2025. Students are encouraged to register early to secure their participation."
      }
    },
    {
      "@type": "Question",
      name: "Who can participate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Students from different age groups can participate. The competition is open to primary, junior, and senior level students as per the category requirements."
      }
    },
    {
      "@type": "Question",
      name: "How do I register?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can register online through our official website at worldskillchallenge.com. Simply fill out the registration form, select your preferred category, and complete the payment process."
      }
    }
  ]
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      <Navbar />
      <FAQ />
      <Footer />
    </>
  )
}
