import Hero from "./components/Hero"

export const metadata = {
  alternates: {
    canonical: "https://worldskillchallenge.com/",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://worldskillchallenge.com/#organization",
      name: "World Skill Challenge",
      alternateName: "WSC",
      url: "https://worldskillchallenge.com",
      logo: {
        "@type": "ImageObject",
        url: "https://worldskillchallenge.com/images/wsc-logo.png",
        width: 512,
        height: 512,
      },
      image: "https://worldskillchallenge.com/images/wsc-logo.png",
      description: "World Skill Challenge 2025 - Crafting Champions of Tomorrow through innovation, teamwork, and real-world problem solving.",
      address: [
        {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "Uttar Pradesh",
          addressLocality: "Noida",
          streetAddress: "D-64, Noida Sector 63",
          postalCode: "201301"
        },
        {
          "@type": "PostalAddress",
          addressCountry: "AE",
          addressRegion: "Dubai",
          addressLocality: "Business Bay",
          streetAddress: "1606, Silver Tower"
        }
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9266300825",
          contactType: "customer service",
          email: "worldskillchallenge@gmail.com",
          availableLanguage: ["English", "Hindi"]
        }
      ],
      sameAs: [
        "https://www.instagram.com/wsc_india/",
        "https://chat.whatsapp.com/DAAiwB4FF83AjxVANWt9YQ"
      ],
      foundingDate: "2025",
      slogan: "Crafting Champions of Tomorrow",
      numberOfEmployees: "10-50"
    },
    {
      "@type": "Event",
      "@id": "https://worldskillchallenge.com/#event",
      name: "World Skill Challenge 2025",
      description:
        "Crafting Champions of Tomorrow. A national and international skill hunt for students across age groups.",
      startDate: "2025-08-30T09:00:00+05:30",
      endDate: "2025-12-20T18:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      performer: {
        "@id": "https://worldskillchallenge.com/#organization",
      },
      location: [
        {
          "@type": "Place",
          name: "Regional Centers",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        },
        {
          "@type": "Place",
          name: "National Finale",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        },
      ],
      organizer: {
        "@id": "https://worldskillchallenge.com/#organization",
      },
      offers: [
        {
          "@type": "Offer",
          name: "IDEA IGNITE",
          price: "0",
          priceCurrency: "INR",
          description: "Research-Based Individual Competition - Price to be announced soon",
          url: "https://worldskillchallenge.com/#register",
          validFrom: "2025-07-01T09:00:00+05:30",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "MYSTERY MAKERS",
          price: "0",
          priceCurrency: "INR",
          description: "STEAM + Kit-Based Team Competition - Price to be announced soon",
          url: "https://worldskillchallenge.com/#register",
          validFrom: "2025-07-01T09:00:00+05:30",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "TECH FOR GOOD",
          price: "0",
          priceCurrency: "INR",
          description: "Robotics Team Competition - Price to be announced soon",
          url: "https://worldskillchallenge.com/#register",
          validFrom: "2025-07-01T09:00:00+05:30",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "TECH THROTTLE",
          price: "0",
          priceCurrency: "INR",
          description: "Gaming - RC Cars + BattleBots - Price to be announced soon",
          url: "https://worldskillchallenge.com/#register",
          validFrom: "2025-07-01T09:00:00+05:30",
          availability: "https://schema.org/InStock",
        },
      ],
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
      },
      image: "https://worldskillchallenge.com/images/wsc-logo.png",
      url: "https://worldskillchallenge.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://worldskillchallenge.com/#website",
      url: "https://worldskillchallenge.com",
      name: "World Skill Challenge 2025",
      description: "National & International Skill Hunt for Young Innovators",
      publisher: {
        "@id": "https://worldskillchallenge.com/#organization",
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://worldskillchallenge.com/?s={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://worldskillchallenge.com/#faq",
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
        }
      ]
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://worldskillchallenge.com/#education",
      name: "World Skill Challenge",
      url: "https://worldskillchallenge.com",
      description: "Educational competition platform for students to develop skills in technology, innovation, and problem-solving",
      educationalCredentialAwarded: "Certificate of Participation",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Competition Categories",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "IDEA IGNITE",
              description: "Research-Based Individual Competition"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "MYSTERY MAKERS",
              description: "STEAM + Kit-Based Team Competition"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "TECH FOR GOOD",
              description: "Robotics Team Competition"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "TECH THROTTLE",
              description: "Gaming - RC Cars + BattleBots"
            }
          }
        ]
      }
    }
  ],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="min-h-screen">
        <Hero />
      </div>
    </>
  )
}
