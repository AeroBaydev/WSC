"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Categories() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mount check for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent background scroll but allow modal scroll
  useEffect(() => {
    const preventBackgroundScroll = (e) => {
      // Allow scrolling within modal content
      const modalContent = document.querySelector('[data-modal-content]');
      const referenceModalContent = document.querySelector('[data-reference-modal-content]');
      if ((modalContent && modalContent.contains(e.target)) || 
          (referenceModalContent && referenceModalContent.contains(e.target))) {
        return; // Allow scrolling within modal
      }
      
      // Prevent background scrolling
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (showDetailsModal || showReferenceModal) {
      // Prevent background scrolling without changing position
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Add scroll event listeners to prevent background scrolling only
      window.addEventListener('scroll', preventBackgroundScroll, { passive: false });
      window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
      window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Remove scroll event listeners
      window.removeEventListener('scroll', preventBackgroundScroll);
      window.removeEventListener('wheel', preventBackgroundScroll);
      window.removeEventListener('touchmove', preventBackgroundScroll);
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('scroll', preventBackgroundScroll);
      window.removeEventListener('wheel', preventBackgroundScroll);
      window.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, [showDetailsModal, showReferenceModal]);

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
        "• Overview: A national-level online quiz for Grades 3–5 to spark curiosity in astronomy and space science. The competition tests knowledge of planets, constellations, astronauts, and space missions through engaging rounds.",
        "• Eligibility: Open to Grades 3–5. Individual participation only.",
        "• Format: Preliminary Round – 20 MCQs (online). Top 30% qualify. Semi-Final – Mixed questions (online). Top 10 qualify. Final – Mixed questions (online).",
        "• Rules & Specs: Correct Answer = +5 points. No negative marking. Camera must remain ON during live rounds. No external help/books allowed. All rounds conducted online.",
        "• Judging: Accuracy, observation skills, and curiosity.",
        "• Pro Tip: Revise basics of the solar system, constellations, astronauts, and recent space missions.",
      ],
    },
  
    "IDEA TANK": {
      title: "IDEA TANK (Entrepreneur Challenge)",
      details: [
        "• Overview: STEM + Entrepreneurship challenge where students identify a real-world problem and propose innovative, market-ready solutions.",
        "• Eligibility: Junior & Senior categories. Individual participation only.",
        "• Format: Submission – Mandatory pitch deck (≤10 slides) with Problem Identification, Solution, Business Model, Impact Assessment. Regional Round – 4–5 min live presentation. National Finale – 7 min pitch + 3 min Q&A.",
        "• Rules & Specs: Submission format – PPT/PDF. Students must bring their own devices. Professional conduct required.",
        "• Judging: Creativity, feasibility, market potential, impact, and communication.",
        "• Pro Tip: Highlight value proposition, scalability, and practical implementation.",
        "• Note: Last date for submission of proposal is 30th October 2025 on info@worldskillchallenge.com",
      ],
    },
  
    "ESPORTS SHOWDOWN": {
      title: "ESPORTS SHOWDOWN (Gaming)",
      details: [
        "• Overview: Competitive esports tournament testing reflexes, strategy, teamwork, and gaming skills.",
        "• Eligibility: Open to Grades 6–12. Teams of 3–5 players.",
        "• Format: Qualifiers – Online knockout round. Regional – Offline round. Finals – Best-of-series (Bo3/Bo5).",
        "• Rules & Specs: Games – BGMI & Free Fire. Standardized in-game settings. No cheats/mods allowed. Players must use personal devices.",
        "• Judging: Teamwork, strategy, communication, compliance, and gaming skills.",
      ],
    },
  
    "MYSTERY MAKERS": {
      title: "MYSTERY MAKERS (Design & Thinking)",
      details: [
        "• Overview: On-the-spot design and problem-solving challenge. Students create prototypes using provided materials and explain the STEAM concepts behind them.",
        "• Eligibility: Teams of 2–3 students (Grades 6–12).",
        "• Format: Regional Round – Mystery problem reveal → Brainstorm → Prototype/Design presentation. Final – Jury Q&A + refinement round.",
        "• Rules & Specs: Materials will be provided on the spot. Time-bound design and build process.",
        "• Judging: Creativity (30%), Feasibility (25%), Presentation (20%), Teamwork (15%), Impact (10%).",
      ],
    },
  
    "TECH FOR GOOD": {
      title: "TECH FOR GOOD (Robotics & Innovation)",
      details: [
        "• Overview: Robotics challenge where students design solutions to social/environmental challenges under the theme 'Robotics for Sustainable Future'.",
        "• Eligibility: Teams of 3–5 students. Open to Grades 6–12.",
        "• Format: Stage 1 – Problem selection + Proposal submission deadline: 30th October 2025 (report to info@worldskillchallenge.com). Stage 2 – Live demo day showcase. Stage 3 – National Finals pitch + testing.",
        "• Rules & Specs: Must demonstrate design, execution, and societal benefit.",
        "• Judging: Innovation & Design (30%), Technical Functionality (30%), Social/Environmental Impact (20%), Presentation & Communication (20%).",
        
      ],
    },
  
    "TECH THROTTLE": {
      title: "TECH THROTTLE (RC Car & Battle Bot)",
      details: [
        "• (a) RC Car Race: Remote-controlled car race on speed and obstacle tracks.",
        "   - Eligibility: Teams of 3 students.",
        "   - Format: Round 1 – Time lap (100m). Round 2 – Obstacle avoidance (zig-zag, ramps).",
        "   - Rules & Specs: Car ≤40×25×20 cm, weight 1–1.5 kg, battery ≤12V. Scoring = Time + penalties. Obstacles hit = +3s, Out of track = +2s.",
        "   - Judging: Performance, speed, accuracy, and control.",
        "",
        "• (b) BattleBots: Sumo-style robot battles.",
        "   - Eligibility: Teams of 3 students.",
        "   - Format: Round 1 – Push-out battles. Round 2 – Push-out + flipping bonus.",
        "   - Rules & Specs: Bot ≤30×30 cm, ≤1.5 kg, ≤12V. Arena 2m ring.",
        "   - Judging: Push-out = 3 points. Flip = +1 point. Performance, durability, strategy.",
        "",
        "• (c) BattleBot Football Edition: Robotic football tournament.",
        "   - Eligibility: Teams of 3–4 students.",
        "   - Format: 5-minute matches on 3m × 2m field. Bots score goals & defend.",
        "   - Rules & Specs: Bot ≤30×30 cm, ≤1.5 kg, ≤12V. Must use plows/wedges. Ball = lightweight foam/plastic.",
        "   - Judging: Goal = 1 point. Strategy, defense, compliance.",
      ],
    },
  };
  

  return (
    <section id="categories" className="py-20 bg-top md:bg-cover bg-contain bg-no-repeat bg-fixed relative" style={{backgroundImage: 'url(/images/exbg.jpg)'}}>
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  
                  {/* Reference Questions Button for STARS & BEYOND */}
                  {category.name === "STARS & BEYOND" && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowReferenceModal(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                      >
                        📚 Reference Questions
                      </button>
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
            Guidelines
          </button>
        </motion.div>

        {showDetailsModal && isMounted && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            data-modal-portal
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDetailsModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              data-modal-content
              style={{
                position: 'relative',
                zIndex: 1000000,
                maxWidth: '90vw',
                maxHeight: '90vh'
              }}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
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
          </div>,
          document.body
        )}

        {/* Reference Questions Modal */}
        {showReferenceModal && isMounted && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            data-modal-portal
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowReferenceModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
              data-reference-modal-content
              style={{
                position: 'relative',
                zIndex: 1000000,
                maxWidth: '90vw',
                maxHeight: '90vh'
              }}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  📚 Stars & Beyond - Reference Questions
                </h2>
                <button
                  onClick={() => setShowReferenceModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* About Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🧭 About the Category</h3>
                  <p className="text-gray-700 mb-4">
                    Welcome to the Stars and Beyond category of the World Science Championship (WSC)! 
                    This guide will help you revise the most important space science facts that may appear in your quiz.
                    Regional Round will be conducted in last week of November 2025.(Tentative)
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">The quiz will test your knowledge of:</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 🌞 The Sun, Moon, and Planets</li>
                      <li>• 🪐 The Solar System and Beyond</li>
                      <li>• 🚀 Indian & Global Space Missions</li>
                      <li>• 🌌 Stars, Galaxies, and Astronauts</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Question types may include:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ Multiple Choice</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ True or False</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ Fill in the Blanks</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ Visual Identification</span>
                    </div>
                  </div>
                </div>

                {/* Key Reference Questions */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 Key Reference Questions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">#</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Question</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Answer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { q: "Which is the closest star to Earth?", a: "Sun" },
                          { q: "How many planets are in our Solar System?", a: "8" },
                          { q: "Which planet is called the 'Red Planet'?", a: "Mars" },
                          { q: "What is Earth's only natural satellite?", a: "Moon" },
                          { q: "Which planet is the largest in the Solar System?", a: "Jupiter" },
                          { q: "Which planet has rings around it?", a: "Saturn" },
                          { q: "What causes day and night on Earth?", a: "Earth's rotation on its axis" },
                          { q: "Which planet is the smallest in the Solar System?", a: "Mercury" },
                          { q: "Which planet is known as Earth's twin?", a: "Venus" },
                          { q: "Which is the hottest planet?", a: "Venus" },
                          { q: "What gives the Sun its energy?", a: "Nuclear fusion" },
                          { q: "Which planet is farthest from the Sun?", a: "Neptune" },
                          { q: "Which planet spins on its side?", a: "Uranus" },
                          { q: "Which is the brightest star in the night sky?", a: "Sirius" },
                          { q: "The pattern of stars in the sky is called a:", a: "Constellation" },
                          { q: "What are shooting stars actually?", a: "Meteors" },
                          { q: "What protects Earth from harmful Sun rays?", a: "Ozone layer" },
                          { q: "The Moon has _______ gravity compared to Earth.", a: "Less" },
                          { q: "Which galaxy is Earth in?", a: "Milky Way" },
                          { q: "The shape of our galaxy is:", a: "Spiral" },
                          { q: "Which star helps travelers find direction at night?", a: "Pole Star (Polaris)" },
                          { q: "The Sun is mainly made of which gases?", a: "Hydrogen and Helium" },
                          { q: "Which telescope orbits around Earth?", a: "Hubble Space Telescope" },
                          { q: "Who was the first person to walk on the Moon?", a: "Neil Armstrong" },
                          { q: "Who was the first Indian in space?", a: "Rakesh Sharma" },
                          { q: "Who was the first Indian woman in space?", a: "Kalpana Chawla" },
                          { q: "Which Indian satellite studied the Moon?", a: "Chandrayaan-1" },
                          { q: "What is the name of India's Mars mission?", a: "Mangalyaan" },
                          { q: "What is India's upcoming human spaceflight mission?", a: "Gaganyaan" },
                          { q: "In which Indian state was ISRO founded?", a: "Kerala" }
                        ].map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.q}</td>
                            <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600">{item.a}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Revision Notes */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🌍 Quick Revision Notes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Planet Facts:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Order of Planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</li>
                        <li>• 'Blue Planet' → Earth</li>
                        <li>• 'Red Planet' → Mars</li>
                        <li>• 'Morning Star' / 'Evening Star' → Venus</li>
                        <li>• 'Gas Giants' → Jupiter & Saturn</li>
                        <li>• 'Ice Giants' → Uranus & Neptune</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Space Facts:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Galaxy nearest to Milky Way → Andromeda</li>
                        <li>• Largest asteroid → Ceres</li>
                        <li>• Fastest rotating planet → Jupiter</li>
                        <li>• Planet with tallest volcano (Olympus Mons) → Mars</li>
                        <li>• First Indian satellite → Aryabhata</li>
                        <li>• First man-made satellite → Sputnik 1</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🧩 Tips for Participants</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Revise daily — focus on space facts and Indian missions.</li>
                    <li>• Watch short ISRO/NASA educational videos for visuals.</li>
                    <li>• Be calm and confident during live rounds.</li>
                    <li>• Keep your camera ON and internet stable if online.</li>
                    <li>• Remember: accuracy and focus matter more than speed!</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
}
