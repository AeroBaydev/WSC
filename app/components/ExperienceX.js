"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Categories() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const categories = [
    {
      name: "STARS & BEYOND",
      subtitle: "Quiz Competition",
      description:
        "Blast off into space! Explore the wonders of the cosmos through exciting quizzes. Answer rapid questions, identify planets and stars, and solve cosmic mysteries to shine as a Young Astronomer.",
      icon: "🔬",
      color: "from-orange-400 to-orange-600",
      ageGroup: "Primary",
      fee2: "₹499",
      team: "Individual",
      // prizes: ["1st: ₹3,000", "2nd: ₹1,500", "3rd: ₹1,000"],
      note: "No materials required.",
    },
    {
      name: "IDEA TANK",
      subtitle: "Entrepreneur Challenge",
      description:
        "Think like an entrepreneur! Identify a real-world problem and pitch an innovative business solution. Submit a business idea deck covering problem, solution, business model, and impact.",
      icon: "🚀",
      color: "from-orange-400 to-orange-600",
      ageGroup: "Junior & Senior",
      fee2: "₹665",
      team: "Individual",
      // prizes: ["1st: ₹3,000", "2nd: ₹1,500", "3rd: ₹1,000"],
      note: "No materials required.",
    },
    {
      name: "ESPORTS SHOWDOWN",
      subtitle: "Gaming - Esports Showdown",
      description:
        " Survive. Strategize. Conquer. Team up and battle it out in high-intensity virtual arenas where only the sharpest minds and fastest reflexes win!",
      icon: "🎮",
      color: "from-red-500 to-orange-600",
      ageGroup: "Junior & Senior",
      fee2: "₹2,499",
      team: "4 Students + 1 Mentor",
      // prizes: ["1st: ₹17,000", "2nd: ₹10,000", "3rd: ₹7,000"],
      note: "Students must carry their own gadgets.",
    },
    {
      name: "MYSTERY MAKERS",
      subtitle: "Design and thinking Competition",
      description:
        "Dive into design! Get surprise materials, think creatively, and build a useful product on the spot. Showcase your teamwork and explain the STEAM concepts behind your creation.",
      icon: "🧩",
      color: "from-orange-500 to-orange-700",
      ageGroup: "Junior & Senior",
      fee2: "₹2,499",
      team: "3 Students + 1 Mentor",
      // prizes: ["1st: ₹8,000", "2nd: ₹5,000", "3rd: ₹3,000"],
      note: "Materials will be provided by the WSC at the time of the event.",
    },
    {
      name: "TECH FOR GOOD",
      subtitle: "Robotics Competition",
      description:
        "Theme: 'Using Technology for the Betterment of Mankind'. Create meaningful tech solutions and present your robotics project.",
      icon: "🤖",
      color: "from-orange-600 to-red-500",
      ageGroup: "Junior & Senior",
      fee2: "₹3,332",
      team: "4 Students + 1 Mentor",
      // prizes: ["1st: ₹11,000", "2nd: ₹7,000", "3rd: ₹4,000"],
      // addon: "Robotics Kit: ₹2,999 Including GST (optional)",
      note: "Students must carry their own materials.",
    },
    {
      name: "TECH THROTTLE -> RC CAR",
      subtitle: "Gaming - RC Cars",
      description:
        "Race. Smash. Survive. Bring your own RC car and take on the ultimate hurdles track. Speed, control, and endurance will decide who crosses the finish line first!",
      icon: "🏎️",
      color: "from-red-500 to-orange-600",
      ageGroup: "Junior & Senior",
      fee2: "₹5,999",
      team: "3 Students + 1 Mentor",
      // prizes: ["1st: ₹17,000", "2nd: ₹10,000", "3rd: ₹7,000"],
      note: "Students must carry their own materials.",
    },
    {
      name: "TECH THROTTLE -> BATTLEBOT",
      subtitle: "Gaming - BattleBots",
      description:
        "Race. Smash. Survive. Build your own BattleBot and bring it to the arena. Compete in thrilling showdowns where strategy, strength, and speed decide the ultimate champion!",
      icon: "🏎️",
      color: "from-red-500 to-orange-600",
      ageGroup: "Junior & Senior",
      fee2: "₹5,999",
      team: "3 Students + 1 Mentor",
      // prizes: ["1st: ₹17,000", "2nd: ₹10,000", "3rd: ₹7,000"],
      note: "Students must carry their own materials.",
    },
    {
      name: "TECH THROTTLE -> BATTLEBOT: FOOTBALL EDITION",
      subtitle: "Gaming - BattleBots: Football Edition",
      description:
        "Build. Battle. Score. Take your BattleBot to the field and outplay rivals in a high-voltage football showdown!",
      icon: "🏎️",
      color: "from-red-500 to-orange-600",
      ageGroup: "Junior & Senior",
      fee2: "₹5,999",
      team: "3 Students + 1 Mentor",
      // prizes: ["1st: ₹17,000", "2nd: ₹10,000", "3rd: ₹7,000"],
      note: "Students must carry their own materials.",
    }
  ];

  const detailedGuidelines = {
    "STARS & BEYOND": {
      title: "STARS & BEYOND (Quiz Competition)",
      details: [
        "• Age Group: Primary",
        "• Participation: Individual",
        "• Objective: Test knowledge of astronomy and space through fun, engaging quiz rounds.",
        "• Format: Online quiz with MCQs, fill-ups, and true/false questions.",
        "• Regional Round: Online live quiz.",
        "• Evaluation: Accuracy, speed, observation skills, curiosity.",
        "• Pro Tip: Revise basics of the solar system, constellations, astronauts, and recent space missions.",
      ],
    },
    "IDEA TANK": {
      title: "IDEA TANK (Entrepreneur Challenge)",
      details: [
        "• Age Group: Junior & Senior",
        "• Participation: Individual",
        "• Objective: Identify a real-world problem and pitch an innovative business/entrepreneurial solution.",
        "• Submission: Business Idea Deck (problem, solution, business model, impact).",
        "• Regional Round: 4–5 min live presentation.",
        "• Evaluation: Creativity, feasibility, market potential, communication.",
        "• Pro Tip: Show clear value proposition, scalability, and practical implementation.",
      ],
    },
    "ESPORTS SHOWDOWN": {
      title: "ESPORTS SHOWDOWN (Gaming)",
      details: [
        "• Age Group: Junior & Senior",
        "• Team: 4 students + 1 mentor",
        "• Format: Round 1 (Online) → Round 2 (Offline – Regional)",
        "• Games: BGMI & Free Fire",
        "• Evaluation: Teamwork, strategy, communication, gaming skills, and compliance",
      ],
    },
    "MYSTERY MAKERS": {
      title: "MYSTERY MAKERS (Design & Thinking)",
      details: [
        "• Age Group: Junior & Senior",
        "• Team: 3 students + 1 mentor",
        "• Format: On-the-spot material will be provided.",
        "• Process: Teams design, build, and present within given time blocks. Students must create a useful product from provided materials and explain the STEAM concepts behind it.",
        "• Evaluation: Creativity, teamwork, design thinking, and resource utilization.",
      ],
    },

    "TECH FOR GOOD": {
      title: "TECH FOR GOOD (Robotics & Innovation)",
      details: [
        "• Age Group: Junior & Senior",
        "• Team: 4 students + 1 mentor",
        "• Theme: Technology for the Betterment of Humankind.",
        "• Submission: Send report on info@worldskillchallenge.com (problem, design, execution, societal benefit).",
        "• Regional Round: Live demonstration of shortlisted projects.",
        "• Evaluation: Innovation, execution, impact, feasibility, alignment with UN SDGs.",
      ],
    },

    "TECH THROTTLE ": {
      title: "TECH THROTTLE (GAMING)",
      details: [
        "• Age Group: Junior & Senior",
        "• Team: Individual or 3 students + 1 mentor (as per category)",
        "• RC Car Race: Obstacle track (speed, accuracy, control).",
        "• BattleBots: Combat robots (points for strikes, defense, survival).",
        "• BattleBot Football Edition: Robot football-style match.",
        "• Safety: No hazardous materials; unsafe bots disqualified.",
        "• Evaluation: Performance, durability, strategy, innovation, compliance.",
      ],
    },
  };

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
            ExperienceX
          </h2>
          <p className="text-lg text-orange-600 font-semibold">
            National STEAM & ROBOTICS Competition
          </p><br />
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Ignite young minds with creativity and innovation through robotics.
            Explore STEAM concepts, problem-solving, and hands-on building in
            exciting challenges.
          </p>
          
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
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
                  <div className="text-3xl md:text-4xl mr-4">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <h4 className="text-base md:text-lg font-semibold text-orange-500">
                      {category.subtitle}
                    </h4>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                  {category.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Age Group:</span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {category.ageGroup}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Team Size:</span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {category.team}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Fee:</span>
                    <span className="text-orange-600 font-bold">
                      {category.fee2}
                    </span>
                  </div>
                  {category.addon && (
                    <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                      {category.addon}
                    </div>
                  )}
                  {category.note && (
                    <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                      Note: {category.note}
                    </div>
                  )}
                </div>

                {/* Prize Money section commented out
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-gray-900 font-semibold mb-2 text-sm">Prize Money:</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {category.prizes.map((prize, prizeIndex) => (
                      <div key={prizeIndex} className="text-center">
                        <div
                          className={`text-xs font-bold ${
                            prizeIndex === 0
                              ? "text-yellow-600"
                              : prizeIndex === 1
                              ? "text-gray-600"
                              : "text-orange-600"
                          }`}
                        >
                          {prize}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                */}
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

        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detailed Category Guidelines
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-8">
                {Object.entries(detailedGuidelines).map(([key, guideline]) => (
                  <div
                    key={key}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {guideline.title}
                    </h3>
                    {guideline.subtitle && (
                      <h4 className="text-lg font-semibold text-orange-500 mb-3">
                        {guideline.subtitle}
                      </h4>
                    )}
                    <div className="space-y-2">
                      {guideline.details.map((detail, index) => (
                        <p
                          key={index}
                          className="text-gray-700 leading-relaxed"
                        >
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
  );
}
