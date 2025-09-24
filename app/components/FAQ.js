"use client"
import { motion } from "framer-motion"
import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Can a student participate in more than one category?",
      answer: "Yes, but the student must register separately for each category they wish to participate in.",
    },
    {
      question: "Can students from different schools participate in the same team?",
      answer: "Yes, provided they belong to the same age category.",
    },
    {
      question: "Can one person be a mentor for multiple teams?",
      answer: "Yes, but mentors are not allowed to assist during the competition.",
    },
    {
      question: "What is the language requirement for submissions?",
      answer: "All reports must be submitted in English.",
    },
    {
      question: "Can WSC intervene in matters of safety?",
      answer: "Yes. WSC reserves all rights, and in the interest of student safety, it may modify rules or disqualify a team if required.",
    },
    {
      question: "Who will provide the materials for the competition?",
      answer: "The requirements are specified in each category. For categories where students must bring their own materials, WSC will not provide them.",
    },
    {
      question: "Who can accompany students during regional and national events?",
      answer: "Along with the participating students and mentor, up to two additional persons may attend. However, their participation will be chargeable for registration.",
    },
    {
      question: "What is the team size?",
      answer: "The team size is specified separately for each category. In case any registered student from a team is unable to attend the regional or national event, the team must inform us by sending an email to info@worldskillchallenge.com.",
    },
  ];
  

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about World Skill Challenge 2025
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-orange-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  Q{index + 1}. {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold text-lg">👉</span>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-orange-100 mb-6">Can't find what you're looking for? Feel free to reach out to us.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/#contact")}
            className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
