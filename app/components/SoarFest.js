"use client"
import { motion } from "framer-motion"
import { useState } from "react"

export default function SoarFest() {
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const categories = [
    // Primary Categories (Up to Grade 5)
    {
      name: "WING-SHOT CHAMPIONSHIP",
      subtitle: "Catapult Glider",
      description:
        "Soar with Gliders! Build a balsa wood glider from material provided at the venue and test your skills. Launch for distance and precision — the farthest flyer takes the win!.",
      icon: "✈️",
      color: "from-orange-400 to-orange-600",
      fee: "₹2,499",
      team: "3 Students + 1 Mentor",
      ageGroup: "Primary & Junior",
      note: "Materials will be provided by the WSC at the time of the event.",
    },
    {
      name: "ROCKETMANIA",
      subtitle: "Rocketry",
      description:
        "Rocket to the Skies! Craft rockets from the materials provided at the venue. Watch them soar high — the tallest launch crowns the champion!",
      icon: "🚀",
      color: "from-orange-500 to-orange-700",
      fee: "₹2,499",
      team: "3 Students + 1 Mentor",
      ageGroup: "Primary & Junior",
      note: "Materials will be provided by the WSC at the time of the event.",
    },
    {
      name: "DRONEX KIDS",
      subtitle: "Mini Drone Flying",
      description:
        "Master the Mini Drone! Take control of mini drones provided at the venue. Complete flying challenges and spot landings to prove your piloting skills!",
      icon: "🚁",
      color: "from-orange-600 to-red-500",
      fee: "₹2,499",
      team: "3 Students + 1 Mentor",
      ageGroup: "Primary",
      note: "Materials will be provided by the WSC at the time of the event.",
    },
    // Junior & Senior Categories (Grade 6-12)
    {
      name: "WING WARRIORS",
      subtitle: " RC Plane Making",
      description:
        "Rule the Skies with RC Planes! Design and build an RC plane with given dimensions and materials. The best-performing and best-designed aircraft claims the title!",
      icon: "🛩️",
      color: "from-red-500 to-orange-600",
      fee: "₹4,165",
      team: "3 Students + 1 Mentor",
      ageGroup: "Junior & Senior",
      note: "Students must carry their own materials.",
    },
    {
      name: "THROTTLE TITANS",
      subtitle: "RC Plane Flying",
      description:
        "Conquer the Skies with RC Flying! Take charge of your RC plane and showcase your piloting skills. Precision, control, and performance will decide who rules the skies!",
      icon: "🛫",
      color: "from-orange-500 to-red-500",
      fee: "₹4,165",
      team: "3 Students + 1 Mentor",
      ageGroup: "Junior & Senior",
      note: "Materials will be provided by the WSC at the time of the event.",
    },
    {
      name: "DRONEX",
      subtitle: "Big Drone Flying",
      description:
        "Master the Big Drone! Take control of Big drones provided at the venue. Complete flying challenges and spot landings to prove your piloting skills!",
      icon: "🚁",
      color: "from-red-500 to-orange-600",
      fee: "₹5,999",
      team: "3 Students + 1 Mentor",
      ageGroup: "Junior & Senior",
      note: "Materials will be provided by the WSC at the time of the event.",
    },
  ]

const detailedGuidelines = {
  "Wing-shot Championship": {
    "title": "Wing-shot Championship",
    "details": [
      "• Age Group: Primary",
      "• Participation: 3 students + 1 mentor.",
      "• Objective: Build and launch a catapult glider.",
      "• Evaluation: Judged on build quality and distance covered."
    ]
  },

  "RocketMania": {
    "title": "RocketMania",
    "details": [
      "• Age Group: Primary",
      "• Participation: 3 students + 1 mentor.",
      "• Objective: Make rockets using air pressure, water, or solid propellant.",
      "• Evaluation: Highest launch altitude wins."
    ]
  },

  "DroneX Kids": {
    "title": "DroneX Kids",
    "details": [
      "• Age Group: Primary",
      "• Participation: 3 students + 1 mentor.",
      "• Objective: Fly mini drones provided at the venue through spot landing challenges.",
      "• Evaluation: Judged on control and accuracy."
    ]
  },

  "Wing Warriors": {
    "title": "Wing Warriors",
    "details": [
      "• Age Group: Junior & Senior",
      "• Participation: 3 students + 1 mentor.",
      "• Objective: Design and build an RC plane as per given guidelines.",
      "• Evaluation: Judged on design quality and flight performance."
    ]
  },

  "Throttle Titans": {
    "title": "Throttle Titans",
    "details": [
      "• Age Group: Junior & Senior",
      "• Participation: 3 students + 1 mentor.",
      "• Objective: Compete in RC plane flying using identical planes provided at the venue.",
      "• Evaluation: Judged on control, precision, and stability."
    ]
  },

  "DroneX": {
    "title": "DroneX",
    "details": [
      "• Age Group: Junior & Senior",
      "• Participation: 3 students + 1 mentor",
      "• Objective: Build and fly drones as per specifications.",
      "• Evaluation: Judged on performance, stability, and control."
    ]
  }
}


  return (
    <section id="soarfest" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-6">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">SoarFest</h2>
            <p className="text-lg text-orange-600 font-semibold">National Aeromodelling Competition</p>
          </div>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Ignite young minds with the thrill of flight, innovation, and hands-on making. Explore aerodynamics,
            engineering design, and flying skills through structured competitions.
          </p>
          
         
        </motion.div>

        {/* Age Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="text-3xl md:text-4xl mr-4">{category.icon}</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{category.name}</h3>
                    <h4 className="text-base md:text-lg font-semibold text-orange-600">{category.subtitle}</h4>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">{category.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Age Group:</span>
                    <span className="text-gray-900 font-semibold text-sm">{category.ageGroup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Team Size:</span>
                    <span className="text-gray-900 font-semibold text-sm">{category.team}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Registration Fee:</span>
                    <span className="text-orange-600 font-bold">{category.fee}</span>
                  </div>
                </div>
                {category.note && (
                    <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                      Note: {category.note}
                    </div>
                  )}
              </div>
            </motion.div>
          ))}
        </div> 

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setShowDetailsModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            More Details
          </button>
        </motion.div>

        {/* What's New Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">What's New in SoarFest?</h3>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
            
              <p className="text-lg leading-relaxed text-center">
                Gear Up Before You Compete! Dive into exclusive workshops on aeromodelling, rocketry, and drone flying. Get hands-on, build confidence, and sharpen your skills — so when the competitions begin, you’re ready to soar higher, faster, and stronger!.
              </p>
             
            </div>
          </div>
        </motion.div>

        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            > 
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Detailed Category Guidelines</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-8">
                {Object.entries(detailedGuidelines).map(([key, guideline]) => (
                  <div key={key} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{guideline.title}</h3>
                    <div className="space-y-2">
                      {guideline.details.map((detail, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
