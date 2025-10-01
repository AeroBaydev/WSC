"use client"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState("") // capture server error

  function ensureSerializable(input, path = "root") {
    try {
      if (input === null || typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
        return input
      }
      if (Array.isArray(input)) {
        return input.map((v, i) => ensureSerializable(v, `${path}[${i}]`))
      }
      if (input instanceof Date) return input.toISOString()
      if (typeof input === "object") {
        const out = {}
        for (const [k, v] of Object.entries(input)) {
          if (typeof v === "function") {
            console.warn("[v0] Stripping function from contact payload at:", `${path}.${k}`)
            continue
          }
          if (typeof v === "undefined") continue
          out[k] = ensureSerializable(v, `${path}.${k}`)
        }
        return out
      }
      console.warn("[v0] Non-serializable in contact payload at:", path, "type:", typeof input)
      return String(input)
    } catch (e) {
      console.error("[v0] ensureSerializable(contact) error at:", path, e)
      return null
    }
  }
  // </CHANGE>

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("")
    setErrorMessage("") // clear previous error

    try {
      const safeBody = ensureSerializable(formData)
      console.log("[v0] Contact submit payload:", safeBody)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeBody),
      })
      const data = await response.json().catch(() => ({})) // safely parse

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
        setErrorMessage(data?.error || "Failed to send message.")
      }
    } catch (error) {
      console.error("[v0] Contact submit error:", error)
      setSubmitStatus("error")
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-top md:bg-cover bg-contain bg-no-repeat bg-fixed relative" style={{backgroundImage: 'url(/images/ctbg.jpg)'}}>
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">Contact Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about World Skill Challenge 2025? We're here to help!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Get in Touch</h3>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-6 flex items-center card-shadow"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Email</h4>
                  <p className="text-gray-600 text-sm md:text-base">info@worldskillchallenge.com</p>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg p-6 card-shadow"
              >
                <h4 className="text-gray-900 font-semibold mb-4">Connect with us</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.instagram.com/wsc_india/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                    Instagram
                  </a>
                  <a
                    href="https://chat.whatsapp.com/DAAiwB4FF83AjxVANWt9YQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    aria-label="Join our WhatsApp Community"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.15 1.6 5.96L0 24l6.2-1.62A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22a9.9 9.9 0 01-5.06-1.4l-.36-.21-3.66.96.98-3.56-.23-.37A9.96 9.96 0 1122 12c0 5.52-4.48 10-10 10zm5.08-6.84c-.28-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.28-.7.88-.86 1.06-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.66-1.57-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.28.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.28-.96.94-.96 2.28s.98 2.64 1.12 2.82c.14.18 1.93 2.94 4.68 4.12.65.28 1.16.45 1.56.58.66.21 1.26.18 1.74.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.2.16-1.31-.07-.11-.25-.18-.53-.32z" />
                    </svg>
                    Join WhatsApp Community
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-6 flex items-center card-shadow"
              >
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">Phone</h4>
                  <p className="text-gray-600 text-sm md:text-base">+91 9266300825</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h4>
              <div className="space-y-3">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-700 font-semibold text-sm">📅 Registration Closes: 4th October 2025</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-6 md:p-8 card-shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select subject</option>
                      <option value="registration">Registration Query</option>
                      <option value="categories">Category Information</option>
                      <option value="technical">Technical Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg text-center"
                  >
                    Thank you for your message! We'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center"
                  >
                    {errorMessage || "Sorry, there was an error sending your message. Please try again."}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full orange-accent text-white py-4 px-8 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
